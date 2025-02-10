import { Locator, Page } from "@playwright/test";

export class CategoryPage {
  public productTitle: Locator;
  public sizeDropdown: Locator;
  public sizeOptions: Locator;
  public addToBagButton: Locator;
  public reviewAndCheckoutButton: Locator;
  public sizeAlert: Locator;
  public removeButton: Locator;
  public shopOurCollectionButton: Locator;

  constructor(private page: Page) {
    this.productTitle = this.page.getByTestId(
      "product-detail-block-product-title"
    );
    this.sizeDropdown = this.page.getByTestId("size-select-button-dropdown");
    this.sizeOptions = this.page
      .getByTestId("size-select-option-list")
      .locator('//div[@role="option" and not(@data-disabled="true")]');
    this.addToBagButton = this.page.getByRole("button", { name: "Add to bag" });
    this.reviewAndCheckoutButton = this.page.getByRole("link", {
      name: "Review Bag and Checkout",
    });
    this.sizeAlert = this.page.getByTestId("product-detail-block-invalid-size");
    this.removeButton = this.page.getByRole("button", { name: /Remove/ });
    this.shopOurCollectionButton = this.page.getByRole("link", {
      name: "Shop Our Collection",
    });
  }

  async selectValidSize() {
    await this.sizeDropdown.click();
    const options = await this.sizeOptions.allTextContents();

    await this.sizeOptions.first().waitFor({ state: "visible" });
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
