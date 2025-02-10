import { Locator, Page } from "@playwright/test";

export class CartPage {
  private BASE_URL = process.env.BASE_URL;
  public checkoutButton: Locator;
  public increaseQuantityButton: Locator;
  public grandTotal: Locator;
  public cartItem: Locator;

  constructor(private page: Page) {
    this.checkoutButton = this.page.getByRole("link", { name: "Checkout" });
    this.increaseQuantityButton = this.page.locator(
      "[aria-label='Increase Quantity']"
    );
    this.grandTotal = this.page.locator("id=grand-total");
    this.cartItem = this.page.getByTestId("cart-item.quantity");
  }

  goToCheckoutPage = async () => {
    await this.checkoutButton.click();
    this.page.waitForURL(`${this.BASE_URL}/checkout`);
  };

  getGrandTotal = () => {
    this.grandTotal = this.page.locator("id=grand-total");
  };
}
