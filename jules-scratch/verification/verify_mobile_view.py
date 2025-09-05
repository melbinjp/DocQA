from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch()
    # Define mobile viewport size, for example, iPhone 11.
    context = browser.new_context(
        viewport={'width': 414, 'height': 896},
        is_mobile=True,
        user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
    )
    page = context.new_page()

    # 1. Arrange: Go to the application's homepage.
    page.goto("http://localhost:5173/")

    # Wait for the main application to be loaded by waiting for the header.
    expect(page.get_by_role("heading", name="📄 Chat with a Doc")).to_be_visible(timeout=10000)

    # 2. Act: Click the language switcher button to open the dropdown.
    page.click(".language-switcher-button")

    # 3. Assert: Check that the new languages are visible in the dropdown.
    expect(page.get_by_role("button", name="EN", exact=True)).to_be_visible()
    expect(page.get_by_role("button", name="ES", exact=True)).to_be_visible()
    expect(page.get_by_role("button", name="FR", exact=True)).to_be_visible()
    expect(page.get_by_role("button", name="DE", exact=True)).to_be_visible()

    # 4. Screenshot: Capture the result with the dropdown open.
    page.screenshot(path="jules-scratch/verification/verification.png")

    # 5. Act: Change the language to German.
    page.click("button:text('DE')")

    # 6. Assert: Check that the lang attribute of the html tag is updated.
    expect(page.locator('html')).to_have_attribute('lang', 'de')

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
