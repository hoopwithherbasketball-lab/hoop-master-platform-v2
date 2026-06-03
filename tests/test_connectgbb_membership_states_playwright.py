import asyncio
from playwright.async_api import async_playwright


BASE_URL = "https://status-hub-39.preview.emergentagent.com"
EMAIL = "coach_test_1780504587@example.com"
PASSWORD = "TestPass123!"


async def run() -> int:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        page.on("console", lambda msg: print(f"CONSOLE[{msg.type}]: {msg.text}"))

        failures: list[str] = []

        try:
            await page.set_viewport_size({"width": 1920, "height": 1080})

            print("STEP 1: Open login page")
            await page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(600)

            print("STEP 2: Login with provided coach credentials")
            await page.get_by_label("Email", exact=True).fill(EMAIL)
            await page.get_by_label("Password", exact=True).fill(PASSWORD)
            await page.get_by_role("button", name="Sign In", exact=True).click(force=True)
            await page.wait_for_timeout(2500)

            current_url = page.url
            print(f"Post-login URL: {current_url}")
            if "/login" in current_url:
                failures.append("Login failed or stayed on /login")

            print("STEP 3: Verify ConnectGBB hub membership-aware state")
            await page.goto(f"{BASE_URL}/connectgbb", wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(2000)

            hub_summary = page.get_by_test_id("connectgbb-membership-summary-card")
            if not await hub_summary.is_visible():
                failures.append("Membership summary card missing on /connectgbb")

            locked_hub = page.get_by_test_id("connectgbb-members-only-locked-state")
            is_hub_locked = await locked_hub.is_visible()
            print(f"Hub locked state visible: {is_hub_locked}")

            if is_hub_locked:
                if not await page.get_by_test_id("connectgbb-locked-complete-profile-link").is_visible():
                    failures.append("Locked hub missing complete-profile link")
            else:
                expected_links = [
                    "connectgbb-hub-link-community-feed",
                    "connectgbb-hub-link-training-hub",
                    "connectgbb-hub-link-my-connections",
                    "connectgbb-hub-link-messages",
                ]
                for tid in expected_links:
                    if not await page.get_by_test_id(tid).is_visible():
                        failures.append(f"Active hub missing section link: {tid}")

            print("STEP 4: Check feed locked/create controls and action testids")
            await page.goto(f"{BASE_URL}/connectgbb/feed", wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(2000)

            feed_locked = page.get_by_test_id("community-feed-membership-locked")
            is_feed_locked = await feed_locked.is_visible()
            print(f"Feed locked state visible: {is_feed_locked}")

            if is_feed_locked:
                if not await page.get_by_test_id("community-feed-refresh-membership-button").is_visible():
                    failures.append("Feed locked state missing refresh membership button")
            else:
                if not await page.get_by_test_id("community-feed-create-post-card").is_visible():
                    failures.append("Feed active state missing create post card")
                if not await page.get_by_test_id("community-feed-create-post-input").is_visible():
                    failures.append("Feed active state missing create post input")
                if not await page.get_by_test_id("community-feed-create-post-button").is_visible():
                    failures.append("Feed active state missing create post button")

                like_count = await page.locator('[data-testid^="community-feed-like-button-"]').count()
                comment_input_count = await page.locator('[data-testid^="community-feed-comment-input-"]').count()
                comment_submit_count = await page.locator('[data-testid^="community-feed-comment-submit-"]').count()
                report_count = await page.locator('[data-testid^="community-feed-report-button-"]').count()
                print(
                    "Feed actions counts: "
                    f"like={like_count}, comment_input={comment_input_count}, "
                    f"comment_submit={comment_submit_count}, report={report_count}"
                )

            print("STEP 5: Check locked states for messages/connections/training")
            await page.goto(f"{BASE_URL}/connectgbb/messages", wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(1200)
            msg_locked = await page.get_by_test_id("messages-locked-state").is_visible()
            print(f"Messages locked visible: {msg_locked}")

            await page.goto(f"{BASE_URL}/connectgbb/connections", wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(1200)
            conn_locked = await page.get_by_test_id("connections-locked-state").is_visible()
            print(f"Connections locked visible: {conn_locked}")

            await page.goto(f"{BASE_URL}/connectgbb/training", wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(1200)
            train_locked = await page.get_by_test_id("training-hub-locked-state").is_visible()
            print(f"Training locked visible: {train_locked}")

            if len({msg_locked, conn_locked, train_locked}) > 1:
                failures.append("Inconsistent membership lock state across messages/connections/training pages")

            print("STEP 6: Verify admin memberships guard remains intact for non-admin")
            await page.goto(f"{BASE_URL}/admin/community-memberships", wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(1500)
            admin_url = page.url
            print(f"Admin memberships landing URL: {admin_url}")
            if "/admin/community-memberships" in admin_url:
                table_visible = await page.get_by_test_id("admin-community-memberships-table-wrapper").is_visible()
                if table_visible:
                    failures.append("Non-admin user unexpectedly accessed admin memberships page")

            print("STEP 7: Check noisy ProtectedRoute debug logging regression")
            logs = []

            def on_console(msg):
                logs.append(msg.text)

            page.off("console", lambda msg: print(f"CONSOLE[{msg.type}]: {msg.text}"))
            page.on("console", on_console)
            await page.goto(f"{BASE_URL}/connectgbb", wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(1200)

            noisy = [l for l in logs if "ProtectedRoute" in l and "console" in l.lower()]
            if noisy:
                failures.append(f"Noisy ProtectedRoute logs found: {noisy[:3]}")

            print("STEP 8: Generic error scan")
            error_text = await page.evaluate("""() => {
                const errorElements = Array.from(document.querySelectorAll('.error, [class*="error"], [id*="error"]'));
                return errorElements.map(el => el.textContent).join(", ");
            }""")
            if error_text:
                print(f"Found error message: {error_text}")
            else:
                print("No error messages found on the page")

            await page.screenshot(path="/app/test_reports/connectgbb_membership_states.png", quality=40, full_page=False)

            if failures:
                print("\nTEST RESULT: FAILED")
                for f in failures:
                    print(f" - {f}")
                await browser.close()
                return 1

            print("\nTEST RESULT: PASSED")
            await browser.close()
            return 0

        except Exception as e:
            print(f"TEST RESULT: ERROR - {str(e)}")
            await browser.close()
            return 2


if __name__ == "__main__":
    raise SystemExit(asyncio.run(run()))
