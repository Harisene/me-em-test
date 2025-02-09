import { test, expect } from "@playwright/test";
import { CategoryPage } from "./pages/Category";
import { CartPage } from "./pages/Cart";
import { CheckoutPage } from "./pages/checkout";

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
    categoryPage.selectValidSize();
    await categoryPage.addToBagButton.click();
    await categoryPage.reviewAndCheckoutButton.click();

    await expect(page).toHaveURL(
      "https://staging.meandem.vercel.app/checkout/cart"
    );
  });

  test("should go to checkout page", async ({ page }) => {
    const categoryPage = new CategoryPage(page);
    const cartPage = new CartPage(page);

    categoryPage.goToCartPage();
    await cartPage.checkoutButton.click();

    await expect(page).toHaveURL("https://staging.meandem.vercel.app/checkout");
  });

  test.only("should be able to place an order", async ({ page }) => {
    const categoryPage = new CategoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await categoryPage.goToCartPage();
    await cartPage.goToCheckoutPage();

    // proceed as a guest
    await checkout.guestCheckoutButton.click();
    await checkout.emailField.click();
    await checkout.emailField.fill("harithsenevi4@gmail.com");
    await checkout.guestContinueToDeliveryButton.click();

    await checkout.fillDeliveryAddress({
      firstName: "Haritha",
      lastName: "Senevi",
      addressLine: "Merlin Wharf",
      phoneNumber: "+441234567890",
      postCode: "LE3 5TH",
      city: "Leicester",
    });

    await checkout.deliveryAddressButton.click();
    await checkout.billingAddressButton.click();
    await checkout.deliveryOptionsButton.click();

    await checkout.fillPaymentDetails({
      cardNumber: "4242424242424242",
      expiryDate: "12/23",
      cvv: "123",
      name: "Haritha Senevi",
      postalCode: "LE3 5TH",
    });

    await checkout.placeOrderButton.click();

    await expect(checkout.alert.first()).toBeVisible();
    await page.pause();
  });
});
