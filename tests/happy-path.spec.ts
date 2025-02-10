import { test, expect } from "@playwright/test";
import { CategoryPage } from "./pages/Category";
import { CartPage } from "./pages/Cart";
import { CheckoutPage } from "./pages/Checkout";

test.describe("proceed to payment", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/palazzo-pant-black`);
    await page.getByRole("button", { name: "Accept All Cookies" }).click();
  });

  test("should have a title", async ({ page }) => {
    // Arrange
    const categoryPage = new CategoryPage(page);

    // Assert
    await expect(categoryPage.productTitle).toHaveText(/Palazzo/);
  });

  test("should select size", async ({ page }) => {
    // Arrange
    const categoryPage = new CategoryPage(page);

    // Act
    const options = await categoryPage.selectValidSize();

    // Assert
    await expect(categoryPage.sizeDropdown).toHaveText(`Size ${options[0]}`);
  });

  test("should go to cart page", async ({ page, baseURL }) => {
    // Arrange
    const categoryPage = new CategoryPage(page);

    // Act
    await categoryPage.selectValidSize();
    await categoryPage.addToBagButton.click();
    await categoryPage.reviewAndCheckoutButton.click();

    // Assert
    await expect(page).toHaveURL(`${baseURL}/checkout/cart`);
  });

  test("should be able to place an order", async ({ page }) => {
    // Arrange
    const categoryPage = new CategoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Act
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

    // Assert
    await expect(
      checkoutPage.alert.filter({ hasText: /Enter a valid/ }).first()
    ).toBeVisible();
  });
});
