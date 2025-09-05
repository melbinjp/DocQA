from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch()

    # --- Mobile View Verification ---
    mobile_context = browser.new_context(
        viewport={'width': 414, 'height': 896},
        is_mobile=True,
        user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
    )
    mobile_page = mobile_context.new_page()
    mobile_page.goto("http://localhost:5173/")
    expect(mobile_page.get_by_role("heading", name="📄 Chat with a Doc")).to_be_visible(timeout=10000)
    mobile_page.screenshot(path="jules-scratch/verification/verification_mobile.png")

    # --- Desktop View Verification ---
    desktop_context = browser.new_context(
        viewport={'width': 1920, 'height': 1080}
    )
    desktop_page = desktop_context.new_page()
    desktop_page.goto("http://localhost:5173/")
    expect(desktop_page.get_by_role("heading", name="📄 Chat with a Doc")).to_be_visible(timeout=10000)

    # --- Language Switcher Verification ---
    # Open the dropdown
    desktop_page.click(".language-switcher-container")

    # Search for German
    desktop_page.keyboard.type("German")

    # Click on the German option
    desktop_page.get_by_text("German (Deutsch)").click()

    # Verify that the language has changed
    expect(desktop_page.locator('.language-switcher-container')).to_contain_text('German')

    desktop_page.screenshot(path="jules-scratch/verification/verification_desktop.png")

    mobile_context.close()
    desktop_context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
