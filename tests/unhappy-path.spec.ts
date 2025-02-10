import { expect, test } from "@playwright/test";
import { CartPage } from "./pages/Cart";
import { CategoryPage } from "./pages/Category";
import { CheckoutPage } from "./pages/Checkout";

test.describe("Category screen", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://staging.meandem.vercel.app/palazzo-pant-black");
    await page.getByRole("button", { name: "Accept All Cookies" }).click();
  });

  test("should show error when size is not selected", async ({ page }) => {
    const category = new CategoryPage(page);

    await category.addToBagButton.click();

    await expect(category.sizeAlert).toHaveText("You must select a size");
  });

  test("should be able to see review and checkout button", async ({ page }) => {
    const category = new CategoryPage(page);
    await category.selectValidSize();

    await category.addToBagButton.click();

    await expect(category.reviewAndCheckoutButton).toBeVisible();
    await expect(category.shopOurCollectionButton).toBeVisible({
      visible: false,
    });
  });

  test("should be able to remove item from cart", async ({ page }) => {
    const category = new CategoryPage(page);
    await category.selectValidSize();
    await category.addToBagButton.click();

    await category.removeButton.click();

    await expect(category.shopOurCollectionButton).toBeVisible();
    await expect(category.reviewAndCheckoutButton).toBeVisible({
      visible: false,
    });
  });
});

test.describe("Cart page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://staging.meandem.vercel.app/palazzo-pant-black");
    await page.getByRole("button", { name: "Accept All Cookies" }).click();

    const categoryPage = new CategoryPage(page);
    await categoryPage.goToCartPage();
  });

  test("should be able to increase item count", async ({ page }) => {
    const cartPage = new CartPage(page);

    const quantity = await cartPage.cartItem.textContent();
    await cartPage.increaseQuantityButton.click();

    await expect(cartPage.cartItem).toHaveText(
      (parseInt(quantity!) + 1).toString()
    );
  });
});

test.describe("Checkout page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://staging.meandem.vercel.app/palazzo-pant-black");
    await page.getByRole("button", { name: "Accept All Cookies" }).click();

    const categoryPage = new CategoryPage(page);
    const cartPage = new CartPage(page);
    await categoryPage.goToCartPage();
    await cartPage.goToCheckoutPage();
  });

  test("should not be able to proceed without guest email", async ({
    page,
  }) => {
    const checkoutPage = new CheckoutPage(page);

    checkoutPage.guestCheckoutButton.click();
    await checkoutPage.guestContinueToDeliveryButton.click();

    await expect(
      checkoutPage.alert.filter({ hasText: /Field is required/ }).first()
    ).toBeVisible();
  });

  test("should not be able to proceed without valid guest email", async ({
    page,
  }) => {
    const checkoutPage = new CheckoutPage(page);

    checkoutPage.guestCheckoutButton.click();
    await checkoutPage.emailField.fill("test");
    await checkoutPage.guestContinueToDeliveryButton.click();

    await expect(
      checkoutPage.alert.filter({ hasText: /Invalid email/ }).first()
    ).toBeVisible();
  });

  test("should not be able to proceed without delivery details", async ({
    page,
  }) => {
    const checkoutPage = new CheckoutPage(page);
    checkoutPage.guestCheckoutButton.click();
    await checkoutPage.emailField.fill("harithsenevi4@gmail.com");
    await checkoutPage.guestContinueToDeliveryButton.click();

    await checkoutPage.fillDeliveryAddress({
      lastName: "Senevi",
      addressLine: "Merlin Wharf",
      phoneNumber: "+441234567890",
      postCode: "LE3 5TH",
      city: "Leicester",
    });
    await checkoutPage.deliveryAddressButton.click();

    await expect(
      checkoutPage.alert.filter({ hasText: /First Name is required/ }).first()
    ).toBeVisible();
  });

  test("should not be able to make the order without valid payment details", async ({
    page,
  }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.proceedAsAGuest();
    await checkoutPage.finishDeliveryAddressStep();
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
  });
});
