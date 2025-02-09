import { expect, Page } from "@playwright/test";
import { CardDetails, DeliverAddress } from "../../models/checkout";

export async function selectValidSize(page: Page) {
  const dropdown = page.getByTestId("size-select-button-dropdown");

  await dropdown.click();
  const optionsLocators = page.locator(
    '//div[@role="option" and not(@data-disabled="true")]'
  );
  const options = await optionsLocators.allTextContents();
  await optionsLocators.first().waitFor();
  await optionsLocators.first().click();

  return { dropdown, options };
}

export async function addToBag(page: Page) {
  const addToBagButton = page.getByRole("button", { name: "Add to bag" });
  await addToBagButton.click();
}

export async function clickReviewAndCheckoutButton(page: Page) {
  return await page
    .getByRole("link", { name: "Review Bag and Checkout" })
    .click();
}

export async function clickCheckoutButton(page: Page) {
  return await page.getByRole("link", { name: "Checkout" }).click();
}

export async function goToCheckoutPage(page: Page) {
  await selectValidSize(page);
  await addToBag(page);
  await clickReviewAndCheckoutButton(page);
  await expect(page).toHaveURL(
    "https://staging.meandem.vercel.app/checkout/cart"
  );
  await clickCheckoutButton(page);
  await expect(page).toHaveURL("https://staging.meandem.vercel.app/checkout");
}

export async function fillDeliveryAddress(
  page: Page,
  data: Partial<DeliverAddress>
) {
  const { firstName, lastName, phoneNumber, addressLine, postCode, city } =
    data;

  if (firstName) {
    const firstNameField = page.getByRole("textbox", { name: /First Name/ });
    await firstNameField.click();
    await firstNameField.fill(firstName);
  }

  if (lastName) {
    const lastNameField = page.getByRole("textbox", { name: /Last Name/ });
    await lastNameField.click();
    await lastNameField.fill(lastName);
  }

  if (phoneNumber) {
    const phoneNumberField = page.getByRole("textbox", {
      name: /Phone Number/,
    });
    await phoneNumberField.click();
    await phoneNumberField.fill(phoneNumber);
  }

  if (addressLine) {
    const addressLineField = page.getByRole("combobox", {
      name: /Address Line1/,
    });
    await addressLineField.click();
    await addressLineField.fill(addressLine);
  }

  if (postCode) {
    const postCodeField = page.getByRole("combobox", { name: /Post code/ });
    await postCodeField.click();
    await postCodeField.fill(postCode);
  }

  if (city) {
    const cityField = page.getByRole("textbox", { name: /City/ });
    await cityField.click();
    await cityField.fill(city);
  }
}

export async function fillCardDetails(page: Page, data: Partial<CardDetails>) {
  const { cardNumber, expiryDate, cvv, name, postalCode } = data;

  if (cardNumber) {
    const cardNumberField = page
      .locator('iframe[name="braintree-hosted-field-number"]')
      .contentFrame()
      .getByRole("textbox", { name: "Credit Card Number" });
    await cardNumberField.click();
    await cardNumberField.fill(cardNumber);
  }

  if (expiryDate) {
    const expiryDateField = page
      .locator('iframe[name="braintree-hosted-field-expirationDate"]')
      .contentFrame()
      .getByRole("textbox", { name: "Expiration Date" });
    await expiryDateField.click();
    await expiryDateField.fill(expiryDate);
  }

  if (cvv) {
    const cvvField = page
      .locator('iframe[name="braintree-hosted-field-cvv"]')
      .contentFrame()
      .getByRole("textbox", { name: "CVV" });
    await cvvField.click();
    await cvvField.fill(cvv);
  }

  if (name) {
    const nameField = page
      .locator('iframe[name="braintree-hosted-field-cardholderName"]')
      .contentFrame()
      .getByRole("textbox", { name: "Cardholder Name" });
    await nameField.click();
    await nameField.fill(name);
  }

  if (postalCode) {
    const postalCodeField = page
      .locator('iframe[name="braintree-hosted-field-postalCode"]')
      .contentFrame()
      .getByRole("textbox", { name: "Postal Code" });
    await postalCodeField.click();
    await postalCodeField.fill(postalCode);
  }
}
