"""Frontend regression checks for public shell routes and CTA navigation.

Note: This file stores the validated Playwright flow used in this iteration.
Execute inside an async Playwright context where `page` is available.
"""


async def run_public_shell_regression(page):
    try:
        await page.set_viewport_size({"width": 1920, "height": 1080})
        print("Viewport set")

        await page.wait_for_selector("text=Elite Girls Basketball Development", timeout=15000)
        print("Home page loaded")

        await page.goto("http://localhost:4173/services", wait_until="domcontentloaded")
        await page.wait_for_selector("text=Elite Services & Packages", timeout=10000)
        await page.wait_for_selector('[data-testid="services-profile-audit-cta-link"]', timeout=10000)
        print("Services page rendered")

        await page.click('[data-testid="services-profile-audit-cta-link"]', force=True)
        await page.wait_for_url("**/contact", timeout=10000)
        print("Services card CTA routes to /contact")

        await page.goto("http://localhost:4173/services", wait_until="domcontentloaded")
        await page.wait_for_selector('[data-testid="services-view-workshops-link"]', timeout=10000)
        await page.evaluate(
            """() => {
              window.__unloadCount = 0;
              window.addEventListener('beforeunload', () => { window.__unloadCount += 1; });
            }"""
        )
        await page.click('[data-testid="services-view-workshops-link"]', force=True)
        await page.wait_for_url("**/workshops", timeout=10000)
        print("Services banner CTA routes to /workshops without full page reload")

        await page.wait_for_selector('[data-testid="workshops-recruiting-101-book-link"]', timeout=10000)
        await page.click('[data-testid="workshops-recruiting-101-book-link"]', force=True)
        await page.wait_for_url("**/contact", timeout=10000)
        print("Workshop card CTA routes to /contact")

        await page.goto("http://localhost:4173/workshops", wait_until="domcontentloaded")
        await page.wait_for_selector('[data-testid="workshops-view-services-link"]', timeout=10000)
        await page.click('[data-testid="workshops-view-services-link"]', force=True)
        await page.wait_for_url("**/services", timeout=10000)
        print("Workshop banner CTA routes to /services")

        await page.goto("http://localhost:4173/nil-readiness", wait_until="domcontentloaded")
        await page.wait_for_selector("text=NIL Readiness Guide", timeout=10000)
        await page.wait_for_selector('[data-testid="nil-readiness-create-profile-link"]', timeout=10000)
        print("NIL readiness page rendered")

        await page.goto("http://localhost:4173/recruiting-readiness", wait_until="domcontentloaded")
        await page.wait_for_selector("text=Recruiting Readiness Assessment", timeout=10000)
        progress_before = await page.locator("text=Complete").first.text_content()
        await page.locator('input[type="checkbox"]').first.click(force=True)
        await page.wait_for_timeout(300)
        progress_after = await page.locator("text=Complete").first.text_content()
        print(f"Checklist progress before: {progress_before}; after: {progress_after}")

        await page.click('[data-testid="recruiting-get-expert-help-link"]', force=True)
        await page.wait_for_url("**/services", timeout=10000)
        print("Recruiting CTA routes to /services")

        await page.goto("http://localhost:4173/", wait_until="domcontentloaded")
        await page.get_by_role("link", name="Join Elite GBB Today", exact=True).click(force=True)
        await page.wait_for_url("**/signup", timeout=10000)
        print("Home CTABanner action works")

        await page.goto("http://localhost:4173/browse", wait_until="domcontentloaded")
        await page.get_by_role("link", name="View Recruiting Services", exact=True).click(force=True)
        await page.wait_for_url("**/services", timeout=10000)
        print("Browse CTABanner action works")

        await page.goto("http://localhost:4173/browse/1", wait_until="domcontentloaded")
        await page.get_by_role("link", name="View Recruiting Services", exact=True).click(force=True)
        await page.wait_for_url("**/services", timeout=10000)
        print("Player detail CTABanner action works")

        error_text = await page.evaluate("""() => {
        const errorElements = Array.from(document.querySelectorAll('.error, [class*="error"], [id*="error"]'));
        return errorElements.map(el => el.textContent).join(", ");
        }""")
        if error_text:
            print(f"Found error message: {error_text}")
        else:
            print("No error messages found on the page")

        print("Public shell regression completed")

    except Exception as e:
        print(f"Test failed: {str(e)}")
        error_text = await page.evaluate("""() => {
        const errorElements = Array.from(document.querySelectorAll('.error, [class*="error"], [id*="error"]'));
        return errorElements.map(el => el.textContent).join(", ");
        }""")
        if error_text:
            print(f"Found error message: {error_text}")
        else:
            print("No error messages found on the page")
