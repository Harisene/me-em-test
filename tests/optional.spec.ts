import { expect, test } from "@playwright/test";
import { CartPage } from "./pages/Cart";
import { CategoryPage } from "./pages/Category";
import { CheckoutPage } from "./pages/Checkout";

test.describe("Optional task", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://staging.meandem.vercel.app/palazzo-pant-black");
    await page.getByRole("button", { name: "Accept All Cookies" }).click();

    const categoryPage = new CategoryPage(page);
    const cartPage = new CartPage(page);
    await categoryPage.goToCartPage();
    await cartPage.goToCheckoutPage();
  });

  test("guest email request throws 500 status code", async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await page.pause();

    await checkoutPage.guestCheckoutButton.click();
    await checkoutPage.emailField.fill("harithsenevi4@gmail.com");
    await page.route(
      "https://staging.meandem.vercel.app/checkout",
      async (route) => {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ success: false }),
        });
      }
    );
    await checkoutPage.guestContinueToDeliveryButton.click();

    await expect(
      checkoutPage.alert.filter({ hasText: /Invalid email/ }).first()
    ).toBeVisible();
  });
});
