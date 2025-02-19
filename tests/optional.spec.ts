import { expect, test } from "@playwright/test";
import { CartPage } from "./pages/Cart";
import { CategoryPage } from "./pages/Category";
import { CheckoutPage } from "./pages/Checkout";

test.describe("Optional task", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/palazzo-pant-black`);
    await page.getByRole("button", { name: "Accept All Cookies" }).click();

    const categoryPage = new CategoryPage(page);
    const cartPage = new CartPage(page);
    await categoryPage.goToCartPage();
    await cartPage.goToCheckoutPage();
  });

  test("guest email request throws 500 status code", async ({
    page,
    baseURL,
  }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.guestCheckoutButton.click();
    await checkoutPage.emailField.fill("harithsenevi4@gmail.com");
    await page.route(`${baseURL}/checkout`, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ success: false }),
      });
    });

    // Act
    await checkoutPage.guestContinueToDeliveryButton.click();

    // Assert
    await expect(
      checkoutPage.alert.filter({ hasText: /Invalid email/ }).first()
    ).toBeVisible();
  });
});
