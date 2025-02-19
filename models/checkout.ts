export interface DeliverAddress {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
  addressLine?: string;
  postCode: string;
  county: string;
  city: string;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
  postalCode: string;
}
