
export const AddressTypes =
  [
    { value: 'shipping', label: 'Shipping' },
    { value: 'billing', label: 'Billing' },
  ]


export class Address {
  nameAddress: string = 'shipping';
  address: string = '';
  address2: string = '';
  city: string = '';
  cities: string[] = [];
  state: string = '';
  zip: string = '';
  country: string = '';
}
