import { expect, test } from "@playwright/test";
import { CartPage } from "./pages/Cart";
import { CategoryPage } from "./pages/Category";
import { CheckoutPage } from "./pages/Checkout";

test.describe("Category screen", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/palazzo-pant-black`);
    await page.getByRole("button", { name: "Accept All Cookies" }).click();
  });

  test("should show error when size is not selected", async ({ page }) => {
    // Arrange
    const category = new CategoryPage(page);

    // Act
    await category.addToBagButton.click();

    // Assert
    await expect(category.sizeAlert).toHaveText("You must select a size");
  });

  test("should be able to see review and checkout button", async ({ page }) => {
    // Arrange
    const category = new CategoryPage(page);
    await category.selectValidSize();

    // Act
    await category.addToBagButton.click();

    // Assert
    await expect(category.reviewAndCheckoutButton).toBeVisible();
    await expect(category.shopOurCollectionButton).toBeVisible({
      visible: false,
    });
  });

  test("should be able to remove item from cart", async ({ page }) => {
    // Arrange
    const category = new CategoryPage(page);
    await category.selectValidSize();
    await category.addToBagButton.click();

    // Act
    await category.removeButton.click();

    // Assert
    await expect(category.shopOurCollectionButton).toBeVisible();
    await expect(category.reviewAndCheckoutButton).toBeVisible({
      visible: false,
    });
  });
});

test.describe("Cart page", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/palazzo-pant-black`);
    await page.getByRole("button", { name: "Accept All Cookies" }).click();

    const categoryPage = new CategoryPage(page);
    await categoryPage.goToCartPage();
  });

  test("should be able to increase item count", async ({ page }) => {
    // Arrange
    const cartPage = new CartPage(page);

    // Act
    const quantity = await cartPage.cartItem.textContent();
    await cartPage.increaseQuantityButton.click();

    // Assert
    await expect(cartPage.cartItem).toHaveText(
      (parseInt(quantity!) + 1).toString()
    );
  });
});

test.describe("Checkout page", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/palazzo-pant-black`);
    await page.getByRole("button", { name: "Accept All Cookies" }).click();

    const categoryPage = new CategoryPage(page);
    const cartPage = new CartPage(page);
    await categoryPage.goToCartPage();
    await cartPage.goToCheckoutPage();
  });

  test("should not be able to proceed without guest email", async ({
    page,
  }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);

    // Act
    checkoutPage.guestCheckoutButton.click();
    await checkoutPage.guestContinueToDeliveryButton.click();

    // Assert
    await expect(
      checkoutPage.alert.filter({ hasText: /Field is required/ }).first()
    ).toBeVisible();
  });

  test("should not be able to proceed without valid guest email", async ({
    page,
  }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);

    // Act
    checkoutPage.guestCheckoutButton.click();
    await checkoutPage.emailField.fill("test");
    await checkoutPage.guestContinueToDeliveryButton.click();

    // Assert
    await expect(
      checkoutPage.alert.filter({ hasText: /Invalid email/ }).first()
    ).toBeVisible();
  });

  test("should not be able to proceed without delivery details", async ({
    page,
  }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);
    checkoutPage.guestCheckoutButton.click();
    await checkoutPage.emailField.fill("harithsenevi4@gmail.com");
    await checkoutPage.guestContinueToDeliveryButton.click();

    // Act
    await checkoutPage.fillDeliveryAddress({
      lastName: "Senevi",
      addressLine: "Merlin Wharf",
      phoneNumber: "+441234567890",
      postCode: "LE3 5TH",
      city: "Leicester",
    });
    await checkoutPage.deliveryAddressButton.click();

    // Assert
    await expect(
      checkoutPage.alert.filter({ hasText: /First Name is required/ }).first()
    ).toBeVisible();
  });

  test("should not be able to make the order without valid payment details", async ({
    page,
  }) => {
    // Arrange
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.proceedAsAGuest();
    await checkoutPage.finishDeliveryAddressStep();
    await checkoutPage.billingAddressButton.click();
    await checkoutPage.deliveryOptionsButton.click();

    // Act
    await checkoutPage.fillPaymentDetails({
      cardNumber: "4242424242424242",
      expiryDate: "12/23",
      cvv: "123",
      name: "Haritha Senevi",
      postalCode: "LE3 5TH",
    });
    await checkoutPage.placeOrderButton.click();

    //Assert
    await expect(
      checkoutPage.alert.filter({ hasText: /Enter a valid/ }).first()
    ).toBeVisible();
  });
});
