import asyncio
from playwright.async_api import async_playwright


BASE_URL = "https://status-hub-39.preview.emergentagent.com"
PENDING_EMAIL = "pending.member.20260603@example.com"
PENDING_PASSWORD = "PendingPass123!"
ADMIN_EMAIL = "admin.member.20260603@example.com"
ADMIN_PASSWORD = "AdminPass123!"


async def run() -> int:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        page.on("console", lambda msg: print(f"CONSOLE[{msg.type}]: {msg.text}"))

        failures: list[str] = []

        try:
            await page.set_viewport_size({"width": 1920, "height": 1080})

            # Login selector regression check
            await page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(1000)
            assert await page.get_by_test_id("login-form-email-input").is_visible()
            assert await page.get_by_test_id("login-form-password-input").is_visible()
            assert await page.get_by_test_id("login-form-submit-button").is_visible()

            # Pending member path
            await page.get_by_test_id("login-form-email-input").fill(PENDING_EMAIL)
            await page.get_by_test_id("login-form-password-input").fill(PENDING_PASSWORD)
            await page.get_by_test_id("login-form-submit-button").click(force=True)
            await page.wait_for_timeout(2800)

            await page.goto(f"{BASE_URL}/connectgbb/feed", wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(2000)
            if not await page.get_by_test_id("community-feed-membership-locked").is_visible():
                failures.append("Pending account did not render community locked state")
            if not await page.get_by_test_id("community-feed-refresh-membership-button").is_visible():
                failures.append("Missing lock-state CTA for pending account")

            await page.get_by_test_id("community-feed-refresh-membership-button").click(force=True)
            await page.wait_for_timeout(2200)
            if not await page.get_by_test_id("community-feed-membership-locked").is_visible():
                failures.append("Lock-state CTA unexpectedly broke locked flow")

            await page.goto(f"{BASE_URL}/admin/feed", wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(1400)
            if "/admin/feed" in page.url and await page.get_by_test_id("admin-community-report-queue-summary").is_visible():
                failures.append("Pending member unexpectedly accessed admin moderation page")

            # Admin path
            await page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(900)
            await page.get_by_test_id("login-form-email-input").fill(ADMIN_EMAIL)
            await page.get_by_test_id("login-form-password-input").fill(ADMIN_PASSWORD)
            await page.get_by_test_id("login-form-submit-button").click(force=True)
            await page.wait_for_timeout(3200)
            if "/login" in page.url:
                failures.append("Admin credentials failed login")

            await page.goto(f"{BASE_URL}/admin/feed", wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(2400)
            if not await page.get_by_test_id("admin-community-report-queue-summary").is_visible():
                failures.append("Admin moderation queue summary missing")

            await page.goto(f"{BASE_URL}/admin/community-memberships", wait_until="domcontentloaded", timeout=45000)
            await page.wait_for_timeout(2500)
            if not await page.get_by_test_id("admin-community-memberships-table-wrapper").is_visible():
                failures.append("Admin memberships table wrapper missing")
            if not await page.get_by_test_id("admin-community-memberships-legacy-mode-text").is_visible():
                failures.append("Legacy fallback message missing on memberships page")

            # Required error selector scan
            error_text = await page.evaluate("""() => {
            const errorElements = Array.from(document.querySelectorAll('.error, [class*="error"], [id*="error"]'));
            return errorElements.map(el => el.textContent).join(", ");
            }""")
            if error_text:
                print(f"Found error message: {error_text}")
            else:
                print("No error messages found on the page")

            if failures:
                print("TEST RESULT: FAILED")
                for failure in failures:
                    print(f" - {failure}")
                await browser.close()
                return 1

            print("TEST RESULT: PASSED")
            await browser.close()
            return 0

        except Exception as e:
            print(f"TEST RESULT: ERROR - {str(e)}")
            await browser.close()
            return 2


if __name__ == "__main__":
    raise SystemExit(asyncio.run(run()))
