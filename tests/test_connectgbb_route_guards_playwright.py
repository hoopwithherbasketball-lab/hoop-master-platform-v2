"""Frontend regression script for ConnectGBB/admin route guards and login readiness.

Run manually with browser automation harness used by testing agents.
"""

# This file intentionally stores the validated Playwright flow used in iteration_3.
# Kept for reuse by next testing agents.

PLAYWRIGHT_SCRIPT = r'''
try:
    await page.set_viewport_size({"width": 1920, "height": 1080})
    page.on("console", lambda msg: print(f"CONSOLE[{msg.type}]: {msg.text}"))

    await page.goto("http://localhost:3000", wait_until="domcontentloaded")
    await page.wait_for_timeout(700)

    protected_routes = [
        "/connectgbb",
        "/connectgbb/feed",
        "/connectgbb/messages",
        "/connectgbb/connections",
        "/connectgbb/training",
        "/admin/community-memberships",
    ]

    for route in protected_routes:
        await page.goto(f"http://localhost:3000{route}", wait_until="domcontentloaded")
        await page.wait_for_timeout(900)
        assert "/login" in page.url, f"Expected login redirect for {route}, got {page.url}"

    await page.goto("http://localhost:3000/login", wait_until="domcontentloaded")
    await page.wait_for_timeout(900)
    assert await page.get_by_role("heading", name="Sign In", exact=True).is_visible()

    # Get error messages using specific selectors
    error_text = await page.evaluate("""() => {
    const errorElements = Array.from(document.querySelectorAll('.error, [class*="error"], [id*="error"]'));
    return errorElements.map(el => el.textContent).join(", ");
    }""")
    if error_text:
        print(f"Found error message: {error_text}")
    else:
        print("No error messages found on the page")

except Exception as e:
    print(f"Error during testing: {str(e)}")
'''
