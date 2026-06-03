"""Frontend regression checks for Phase 7 public shell route/testid coverage.

Execute inside an async Playwright context where `page` is available.
"""


async def run_public_shell_regression(page):
    try:
        await page.set_viewport_size({"width": 1920, "height": 1080})
        print("Viewport set")

        await page.goto("http://localhost:3000/", wait_until="domcontentloaded")
        await page.wait_for_selector('[data-testid="home-start-journey-link"]', timeout=10000)
        await page.wait_for_selector('[data-testid="home-join-elite-link"]', timeout=10000)
        await page.evaluate("""() => {
          window.__unload_count = 0;
          window.addEventListener('beforeunload', () => { window.__unload_count += 1; });
        }""")
        await page.click('[data-testid="home-join-elite-link"]', force=True)
        await page.wait_for_url("**/signup", timeout=10000)
        print("Home links and CTA routing validated")

        await page.goto("http://localhost:3000/browse", wait_until="domcontentloaded")
        await page.wait_for_selector('[data-testid="browse-search-input"]', timeout=10000)
        await page.wait_for_selector('[data-testid="browse-grad-year-select"]', timeout=10000)
        await page.wait_for_selector('[data-testid="browse-position-select"]', timeout=10000)
        await page.wait_for_selector('[data-testid="browse-division-select"]', timeout=10000)
        print("Browse filters test IDs validated")

        await page.goto("http://localhost:3000/browse/1", wait_until="domcontentloaded")
        await page.wait_for_selector('[data-testid="player-detail-back-link"]', timeout=10000)
        print("Player detail back link validated")

        await page.goto("http://localhost:3000/contact", wait_until="domcontentloaded")
        await page.wait_for_selector('[data-testid="contact-name-input"]', timeout=10000)
        await page.wait_for_selector('[data-testid="contact-send-message-button"]', timeout=10000)
        await page.wait_for_selector('[data-testid="contact-view-services-link"]', timeout=10000)
        print("Contact form and CTA test IDs validated")

        await page.goto("http://localhost:3000/events", wait_until="domcontentloaded")
        await page.wait_for_selector('[data-testid="events-dashboard-link"]', timeout=10000)
        await page.wait_for_selector('[data-testid="events-explore-services-link"]', timeout=10000)
        print("Events CTA links validated")

        await page.goto("http://localhost:3000/faq", wait_until="domcontentloaded")
        await page.wait_for_selector('[data-testid="faq-item-0-summary"]', timeout=10000)
        await page.click('[data-testid="faq-item-0-summary"]', force=True)
        await page.wait_for_selector('[data-testid="faq-contact-support-link"]', timeout=10000)
        print("FAQ accordion and CTA validated")

        await page.goto("http://localhost:3000/checkout/recruiting-review", wait_until="domcontentloaded")
        await page.wait_for_selector('[data-testid="checkout-full-name-input"]', timeout=10000)
        await page.wait_for_selector('[data-testid="checkout-complete-purchase-button"]', timeout=10000)
        print("Checkout form/button test IDs validated")

        await page.goto("http://localhost:3000/watch", wait_until="domcontentloaded")
        await page.wait_for_timeout(1200)
        cards = await page.locator('[data-testid^="channel-card-link-"]').count()
        if cards > 0:
            await page.wait_for_selector('[data-testid="channels-search-input"]', timeout=10000)
            await page.locator('[data-testid^="channel-card-link-"]').first.click(force=True)
            await page.wait_for_selector('[data-testid="channel-watch-back-link"]', timeout=10000)
        await page.goto("http://localhost:3000/watch/non-existent-channel", wait_until="domcontentloaded")
        await page.wait_for_selector('[data-testid="channel-watch-browse-channels-link"]', timeout=10000)
        print("Watch routes validated")

        await page.goto("http://localhost:3000/embed/docs", wait_until="domcontentloaded")
        await page.wait_for_selector('[data-testid="embed-docs-channel-select"]', timeout=10000)
        await page.wait_for_selector('[data-testid="embed-docs-copy-html-button"]', timeout=10000)
        await page.wait_for_selector('[data-testid="embed-docs-width-input"]', timeout=10000)
        print("Embed docs controls test IDs validated")

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
