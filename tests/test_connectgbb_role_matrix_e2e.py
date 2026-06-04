import argparse
import asyncio
from playwright.async_api import async_playwright


PENDING_EMAIL = "pending.member.20260603@example.com"
PENDING_PASSWORD = "PendingPass123!"
ADMIN_EMAIL = "admin.member.20260603@example.com"
ADMIN_PASSWORD = "AdminPass123!"
COACH_EMAIL = "coach.member.1780593208@example.com"
COACH_PASSWORD = "CoachPass123!"


async def run_for_base_url(base_url: str) -> int:
    failures: list[str] = []
    print(f"\n=== Running role matrix E2E for: {base_url} ===")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        async def with_fresh_page():
            context = await browser.new_context()
            page = await context.new_page()
            page.on("console", lambda msg: print(f"CONSOLE[{msg.type}]: {msg.text}"))
            await page.set_viewport_size({"width": 1920, "height": 1080})
            return context, page

        async def login(page, email: str, password: str):
            await page.goto(f"{base_url}/login", wait_until="domcontentloaded", timeout=60000)
            await page.get_by_test_id("login-form-email-input").fill(email)
            await page.get_by_test_id("login-form-password-input").fill(password)
            await page.get_by_test_id("login-form-submit-button").click(force=True)
            await page.wait_for_timeout(2600)

        try:
            # Pending member expectations
            pending_context, pending_page = await with_fresh_page()
            await login(pending_page, PENDING_EMAIL, PENDING_PASSWORD)
            page = pending_page
            await page.goto(f"{base_url}/connectgbb/feed", wait_until="domcontentloaded", timeout=60000)
            await page.wait_for_timeout(1600)
            if not await page.get_by_test_id("community-feed-membership-locked").is_visible():
                failures.append("Pending member should see locked community feed state")
            if await page.get_by_test_id("community-feed-create-post-card").count() > 0:
                failures.append("Pending member should not see create post card")
            await pending_context.close()

            # Coach expectations
            coach_context, coach_page = await with_fresh_page()
            await login(coach_page, COACH_EMAIL, COACH_PASSWORD)
            page = coach_page
            await page.goto(f"{base_url}/connectgbb/feed", wait_until="domcontentloaded", timeout=60000)
            await page.wait_for_timeout(1600)
            if await page.get_by_test_id("community-feed-membership-locked").count() > 0:
                failures.append("Coach should not see locked feed state")
            if not await page.get_by_test_id("community-feed-create-post-card").is_visible():
                failures.append("Coach should see create post card")
            await coach_context.close()

            # Admin expectations
            admin_context, admin_page = await with_fresh_page()
            await login(admin_page, ADMIN_EMAIL, ADMIN_PASSWORD)
            page = admin_page
            await page.goto(f"{base_url}/admin/feed", wait_until="domcontentloaded", timeout=60000)
            await page.wait_for_timeout(1800)
            if not await page.get_by_test_id("admin-community-report-queue-summary").is_visible():
                failures.append("Admin report queue summary missing")

            await page.goto(f"{base_url}/admin/community-memberships", wait_until="domcontentloaded", timeout=60000)
            await page.wait_for_timeout(1800)
            if not await page.get_by_test_id("admin-community-memberships-table-wrapper").is_visible():
                failures.append("Admin memberships table missing")
            await admin_context.close()

            if failures:
                print("ROLE MATRIX RESULT: FAILED")
                for failure in failures:
                    print(f" - {failure}")
                await browser.close()
                return 1

            print("ROLE MATRIX RESULT: PASSED")
            await browser.close()
            return 0

        except Exception as exc:
            print(f"ROLE MATRIX RESULT: ERROR - {exc}")
            await browser.close()
            return 2


async def main() -> int:
    parser = argparse.ArgumentParser(description="Run ConnectGBB role-matrix E2E")
    parser.add_argument("--base-url", action="append", required=True, help="Base URL(s) to test")
    args = parser.parse_args()

    overall = 0
    for url in args.base_url:
        code = await run_for_base_url(url.rstrip("/"))
        overall = max(overall, code)

    return overall


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
