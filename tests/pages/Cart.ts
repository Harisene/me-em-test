import { Locator, Page } from "@playwright/test";

export class CartPage {
  public checkoutButton: Locator;

  constructor(private page: Page) {
    this.checkoutButton = this.page.getByRole("link", { name: "Checkout" });
  }

  goToCheckoutPage = async () => {
    await this.checkoutButton.click();
    this.page.waitForURL("https://staging.meandem.vercel.app/checkout");
  };
}
