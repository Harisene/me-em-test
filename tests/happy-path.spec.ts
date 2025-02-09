import { test, expect } from "@playwright/test";
import {
  addToBag,
  clickCheckoutButton,
  clickReviewAndCheckoutButton,
  fillCardDetails,
  fillDeliveryAddress,
  goToCheckoutPage,
  selectValidSize,
} from "./shared/common-user-actions";

test.describe("proceed to payment", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://staging.meandem.vercel.app/palazzo-pant-black");
    await page.getByRole("button", { name: "Accept All Cookies" }).click();
  });

  test("has title", async ({ page }) => {
    const title = page.getByTestId("product-detail-block-product-title");

    await expect(title).toHaveText(/Palazzo/);
  });

  test("should select size", async ({ page }) => {
    const { dropdown, options } = await selectValidSize(page);

    await expect(dropdown).toHaveText(`Size ${options[0]}`);
  });

  test("should go to cart page", async ({ page }) => {
    await selectValidSize(page);

    await addToBag(page);
    await clickReviewAndCheckoutButton(page);

    await expect(page).toHaveURL(
      "https://staging.meandem.vercel.app/checkout/cart"
    );
  });

  test("should go to checkout page", async ({ page }) => {
    await selectValidSize(page);
    await addToBag(page);
    await clickReviewAndCheckoutButton(page);
    await expect(page).toHaveURL(
      "https://staging.meandem.vercel.app/checkout/cart"
    );

    await clickCheckoutButton(page);

    await expect(page).toHaveURL("https://staging.meandem.vercel.app/checkout");
  });

  test("should be able to fill card details", async ({ page }) => {
    await goToCheckoutPage(page);

    await page.getByRole("button", { name: "Continue as guest" }).click();
    await page.getByRole("textbox", { name: "Enter email address*" }).click();
    await page
      .getByRole("textbox", { name: /Enter email address/ })
      .fill("harithsenevi4@gmail.com");
    await page.getByRole("button", { name: "Continue to Delivery" }).click();

    await fillDeliveryAddress(page, {
      firstName: "Haritha",
      lastName: "Senevi",
      addressLine: "Merlin Wharf",
      phoneNumber: "+441234567890",
      postCode: "LE3 5TH",
      city: "Leicester",
    });

    await page
      .getByTestId("deliveryAddress")
      .getByRole("button", { name: "Submit to Continue" })
      .click();
    await page
      .getByTestId("billingAddress")
      .getByRole("button", { name: "Submit to Continue" })
      .click();
    await page
      .getByTestId("deliveryOptions")
      .getByRole("button", { name: "Submit to Continue" })
      .click();

    await fillCardDetails(page, {
      cardNumber: "123",
      expiryDate: "12/23",
      cvv: "123",
      name: "Haritha Senevi",
      postalCode: "LE3 5TH",
    });

    const placeOrderButton = page.getByRole("button", {
      name: /Place Order/,
    });
    await placeOrderButton.click();

    const alertList = page.getByRole("alert").first();

    await expect(alertList).toBeVisible();
  });
});
