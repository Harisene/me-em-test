import { test, expect } from "@playwright/test";
import { CategoryPage } from "./pages/Category";
import { CartPage } from "./pages/Cart";
import { CheckoutPage } from "./pages/Checkout";

test.describe("proceed to payment", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://staging.meandem.vercel.app/palazzo-pant-black");
    await page.getByRole("button", { name: "Accept All Cookies" }).click();
  });

  test("should have a title", async ({ page }) => {
    const categoryPage = new CategoryPage(page);
    await expect(categoryPage.productTitle).toHaveText(/Palazzo/);
  });

  test("should select size", async ({ page }) => {
    const categoryPage = new CategoryPage(page);

    const options = await categoryPage.selectValidSize();

    await expect(categoryPage.sizeDropdown).toHaveText(`Size ${options[0]}`);
  });

  test("should go to cart page", async ({ page }) => {
    const categoryPage = new CategoryPage(page);
    await categoryPage.selectValidSize();
    await categoryPage.addToBagButton.click();
    await categoryPage.reviewAndCheckoutButton.click();

    await expect(page).toHaveURL(
      "https://staging.meandem.vercel.app/checkout/cart"
    );
  });

  test("should be able to place an order", async ({ page }) => {
    const categoryPage = new CategoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await categoryPage.goToCartPage();
    await cartPage.goToCheckoutPage();

    // proceed as a guest
    await checkoutPage.guestCheckoutButton.click();
    await checkoutPage.emailField.click();
    await checkoutPage.emailField.fill("harithsenevi4@gmail.com");
    await checkoutPage.guestContinueToDeliveryButton.click();

    await checkoutPage.fillDeliveryAddress({
      firstName: "Haritha",
      lastName: "Senevi",
      addressLine: "Merlin Wharf",
      phoneNumber: "+441234567890",
      postCode: "LE3 5TH",
      city: "Leicester",
    });

    await checkoutPage.deliveryAddressButton.click();
    await checkoutPage.billingAddressButton.click();
    await checkoutPage.deliveryOptionsButton.click();

    await checkoutPage.fillPaymentDetails({
      cardNumber: "4242424242424242",
      expiryDate: "12/23",
      cvv: "123",
      name: "Haritha Senevi",
      postalCode: "LE3 5TH",
    });

    await checkoutPage.placeOrderButton.click();

    await expect(
      checkoutPage.alert.filter({ hasText: /Enter a valid/ }).first()
    ).toBeVisible();
    await page.pause();
  });
});
