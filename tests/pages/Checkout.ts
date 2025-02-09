import { Locator, Page } from "@playwright/test";
import { DeliverAddress, PaymentDetails } from "../../models/checkout";

export class CheckoutPage {
  public guestCheckoutButton: Locator;
  public emailField: Locator;
  public guestContinueToDeliveryButton: Locator;
  public firstNameField: Locator;
  public lastNameField: Locator;
  public phoneNumberField: Locator;
  public addressLineField: Locator;
  public postCodeField: Locator;
  public cityField: Locator;
  public deliveryAddressButton: Locator;
  public billingAddressButton: Locator;
  public deliveryOptionsButton: Locator;
  public creditCardNumberField: Locator;
  public expiryDateField: Locator;
  public cvvField: Locator;
  public cardHolderNameField: Locator;
  public paymentPostalCodeField: Locator;
  public placeOrderButton: Locator;
  public alert: Locator;

  constructor(private page: Page) {
    this.guestCheckoutButton = this.page.getByRole("button", {
      name: "Continue as guest",
    });
    this.emailField = this.page.getByRole("textbox", {
      name: "Enter email address*",
    });
    this.guestContinueToDeliveryButton = this.page.getByRole("button", {
      name: "Continue to Delivery",
    });
    this.firstNameField = this.page.getByRole("textbox", {
      name: /First Name/,
    });
    this.lastNameField = this.page.getByRole("textbox", { name: /Last Name/ });
    this.phoneNumberField = this.page.getByRole("textbox", {
      name: /Phone Number/,
    });
    this.addressLineField = this.page.getByRole("combobox", {
      name: /Address Line1/,
    });
    this.postCodeField = this.page.getByRole("combobox", { name: /Post code/ });
    this.cityField = this.page.getByRole("textbox", { name: /City/ });
    this.deliveryAddressButton = this.page
      .getByTestId("deliveryAddress")
      .getByRole("button", { name: "Submit to Continue" });
    this.billingAddressButton = this.page
      .getByTestId("billingAddress")
      .getByRole("button", { name: "Submit to Continue" });
    this.deliveryOptionsButton = this.page
      .getByTestId("deliveryOptions")
      .getByRole("button", { name: "Submit to Continue" });
    this.creditCardNumberField = this.page
      .locator('iframe[name="braintree-hosted-field-number"]')
      .contentFrame()
      .getByRole("textbox", { name: "Credit Card Number" });
    this.expiryDateField = this.page
      .locator('iframe[name="braintree-hosted-field-expirationDate"]')
      .contentFrame()
      .getByRole("textbox", { name: "Expiration Date" });
    this.cvvField = this.page
      .locator('iframe[name="braintree-hosted-field-cvv"]')
      .contentFrame()
      .getByRole("textbox", { name: "CVV" });
    this.cardHolderNameField = this.page
      .locator('iframe[name="braintree-hosted-field-cardholderName"]')
      .contentFrame()
      .getByRole("textbox", { name: "Cardholder Name" });
    this.paymentPostalCodeField = this.page
      .locator('iframe[name="braintree-hosted-field-postalCode"]')
      .contentFrame()
      .getByRole("textbox", { name: "Postal Code" });
    this.placeOrderButton = this.page.getByRole("button", {
      name: /Place Order/,
    });
    this.alert = this.page.getByRole("alert");
  }

  async fillDeliveryAddress(data: Partial<DeliverAddress>) {
    const { firstName, lastName, phoneNumber, addressLine, postCode, city } =
      data;

    if (firstName) {
      const firstNameField = this.page.getByRole("textbox", {
        name: /First Name/,
      });
      await firstNameField.click();
      await firstNameField.fill(firstName);
    }

    if (lastName) {
      await this.lastNameField.click();
      await this.lastNameField.fill(lastName);
    }

    if (phoneNumber) {
      await this.phoneNumberField.click();
      await this.phoneNumberField.fill(phoneNumber);
    }

    if (addressLine) {
      await this.addressLineField.click();
      await this.addressLineField.fill(addressLine);
    }

    if (postCode) {
      await this.postCodeField.click();
      await this.postCodeField.fill(postCode);
    }

    if (city) {
      await this.cityField.click();
      await this.cityField.fill(city);
    }
  }

  async fillPaymentDetails(data: Partial<PaymentDetails>) {
    const { cardNumber, expiryDate, cvv, name, postalCode } = data;

    if (cardNumber) {
      await this.creditCardNumberField.click();
      await this.creditCardNumberField.fill(cardNumber);
    }

    if (expiryDate) {
      await this.expiryDateField.click();
      await this.expiryDateField.fill(expiryDate);
    }

    if (cvv) {
      await this.cvvField.click();
      await this.cvvField.fill(cvv);
    }

    if (name) {
      await this.cardHolderNameField.click();
      await this.cardHolderNameField.fill(name);
    }

    if (postalCode) {
      await this.paymentPostalCodeField.click();
      await this.paymentPostalCodeField.fill(postalCode);
    }
  }
}
