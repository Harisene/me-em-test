import { Locator, Page } from "@playwright/test";

export class CategoryPage {
  public productTitle: Locator;
  public sizeDropdown: Locator;
  public sizeOptions: Locator;
  public addToBagButton: Locator;
  public reviewAndCheckoutButton: Locator;

  constructor(private page: Page) {
    this.productTitle = this.page.getByTestId(
      "product-detail-block-product-title"
    );
    this.sizeDropdown = this.page.getByTestId("size-select-button-dropdown");
    this.sizeOptions = this.page.locator(
      '//div[@role="option" and not(@data-disabled="true")]'
    );
    this.addToBagButton = this.page.getByRole("button", { name: "Add to bag" });
    this.reviewAndCheckoutButton = this.page.getByRole("link", {
      name: "Review Bag and Checkout",
    });
  }

  async selectValidSize() {
    await this.sizeDropdown.click();
    const options = await this.sizeOptions.allTextContents();

    await this.sizeOptions.first().waitFor();
    await this.sizeOptions.first().click();

    return options;
  }

  async goToCartPage() {
    await this.selectValidSize();
    await this.addToBagButton.click();
    await this.reviewAndCheckoutButton.click();
    return this.page.waitForURL(
      "https://staging.meandem.vercel.app/checkout/cart"
    );
  }
}
