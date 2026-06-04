import argparse
import asyncio
import urllib.parse
from playwright.async_api import async_playwright


PENDING_EMAIL = "pending.member.20260603@example.com"
PENDING_PASSWORD = "PendingPass123!"
ADMIN_EMAIL = "admin.member.20260603@example.com"
ADMIN_PASSWORD = "AdminPass123!"
COACH_EMAIL = "coach.member.1780593208@example.com"
COACH_PASSWORD = "CoachPass123!"


async def run_for_base_url(base_url: str, allowlist_token: str | None = None) -> int:
    failures: list[str] = []
    print(f"\n=== Running role matrix E2E for: {base_url} ===")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        async def with_fresh_page():
            headers = {}
            if allowlist_token:
                headers["x-e2e-allowlist-token"] = allowlist_token

            context = await browser.new_context(extra_http_headers=headers if headers else None)
            page = await context.new_page()
            page.on("console", lambda msg: print(f"CONSOLE[{msg.type}]: {msg.text}"))
            await page.set_viewport_size({"width": 1920, "height": 1080})
            return context, page

        def append_allowlist(url: str) -> str:
            if not allowlist_token:
                return url
            parsed = urllib.parse.urlparse(url)
            query = urllib.parse.parse_qs(parsed.query)
            query["e2e_token"] = [allowlist_token]
            return urllib.parse.urlunparse(parsed._replace(query=urllib.parse.urlencode(query, doseq=True)))

        async def login(page, email: str, password: str):
            await page.goto(append_allowlist(f"{base_url}/login"), wait_until="domcontentloaded", timeout=60000)
            await page.get_by_test_id("login-form-email-input").fill(email)
            await page.get_by_test_id("login-form-password-input").fill(password)
            await page.get_by_test_id("login-form-submit-button").click(force=True)
            await page.wait_for_timeout(2600)

        try:
            # Pending member expectations
            pending_context, pending_page = await with_fresh_page()
            await login(pending_page, PENDING_EMAIL, PENDING_PASSWORD)
            page = pending_page
            await page.goto(append_allowlist(f"{base_url}/connectgbb/feed"), wait_until="domcontentloaded", timeout=60000)
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
            await page.goto(append_allowlist(f"{base_url}/connectgbb/feed"), wait_until="domcontentloaded", timeout=60000)
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
            await page.goto(append_allowlist(f"{base_url}/admin/feed"), wait_until="domcontentloaded", timeout=60000)
            await page.wait_for_timeout(1800)
            if not await page.get_by_test_id("admin-community-report-queue-summary").is_visible():
                failures.append("Admin report queue summary missing")

            await page.goto(append_allowlist(f"{base_url}/admin/community-memberships"), wait_until="domcontentloaded", timeout=60000)
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
    parser.add_argument("--preview-allowlist-token", default=None, help="Optional preview allowlist token")
    args = parser.parse_args()

    overall = 0
    for url in args.base_url:
        normalized = url.rstrip("/")
        attempts = 2 if ".preview." in normalized else 1
        code = 2

        for attempt in range(1, attempts + 1):
            code = await run_for_base_url(normalized, args.preview_allowlist_token)
            if code == 0:
                break
            if attempt < attempts:
                print(f"Retrying {normalized} after transient failure (attempt {attempt + 1}/{attempts})...")
                await asyncio.sleep(4)

        overall = max(overall, code)

    return overall


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
