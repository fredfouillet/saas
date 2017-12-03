import { Form } from '../picture/form/form.model';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';
// import { Project } from '../project/project.model';
import { Companie } from '../companie/companie.model';
import { Drawing } from './single/drawing/drawing.model';
import { DrawingSignature } from './single/drawingSignature/drawingSignature.model';


export class Quote {
  _id: string = '';
  clients: User[] = [];
  historyClients: User[] = [];
  name: string = '';
  statusQuote: number = 0;
  statusQuoteString: string = '';
  typeQuote: string = 'quote';
  quoteNumber: number;
  isSigned:boolean = false;
  // _users: User[] = [];
  // ownerQuotes: User[] = [];
  // companieClients: Companie[] = []
  forms: Form[] = [];
  parentQuotes: Quote[] = [];
  products: Product[] = [];
  // projects: Project[] = [];
  devisDetails: DevisDetail[] = []
  priceQuote: PriceQuote = new PriceQuote();
  // signature: Signature = new Signature();
  detail: Detail = new Detail();
  drawing: Drawing = new Drawing();
  drawingSignature: DrawingSignature = new DrawingSignature();


}

export class Detail {
  currency: string = '';
  quoteRef: string = '';
  dateQuote: DateQuote = new DateQuote()
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 30);

export class DateQuote {
  issueDate: Date = new Date();
  // issueDateString: string = '';
  expiryDate: Date = tomorrow;
  // expiryDateString: string ='';
  dateInvoicePaid: Date = new Date();
  // dateInvoicePaidString: string ='';
}



//
// export class Signature {
//   base64: string = '';
//   isSigned: boolean = false;
//   dateSignature: Date;
//   users: User[] = [];
// }
export class PriceQuote {
  priceQuoteWithoutTaxes: number = 0;
  priceQuoteWithTaxes: number = 0;
  discountGlobal: number = 0;
  painfulnessGlobal: number = 0;
  priceGlobalWithDiscountWithSurface: number = 0;
  priceGlobalWithTaxesWithDiscountWithSurfaceWithPainfulness: number = 0;
  priceGlobalWithDiscountWithSurfaceWithPainfulness: number = 0;
  vatGlobal: number = 0;
  priceQuoteTaxes: PriceQuoteTaxe[] = []
}

export class PriceQuoteTaxe {
  VAT: number = 0;
  TotalVAT: number = 0;
}


export const ModelVATs: number[] = [0, 5.5, 10]


export class BucketProduct {
  typeRow: string = '';
  title: string = '';
  productInit: Product[] = [];
  priceWithoutTaxes: number = 0;
  priceWithoutTaxesWithDiscount: number = 0;
  priceWithQuantityWithDiscount: number = 0;
  priceWithQuantityWithDiscountWithSurface: number = 0;
  priceWithTaxesWithQuantityWithDiscountWithSurface: number = 0;
  priceWithTaxesWithQuantityWithDiscount: number = 0;
  priceWithTaxesWithDiscount: number = 0;
  priceWithTaxes: number = 0;
  priceWithQuantity: number = 0;

  priceWithTaxesWithQuantity: number = 0;
  vat: number = 0;
  quantity: number = 1;
  length: number = 1;
  width: number = 1;
  surface: number = 1;
  discount: number = 0;
  isEditMode: boolean = false;
}

export class TextToQuote {
    title: string = '';
    priceWithoutTaxes: number;
  }

export class DevisDetail {
  nameBucketProducts: string = '';
  bucketProducts: BucketProduct[] = []
}

export const StatusQuotes =
[
  {indexStatus: 0, label: 'Pending Approval', icon: 'alarm', color: 'primary'},
  {indexStatus: 1, label: 'Signed', icon: 'done', color: 'accent'},
  {indexStatus: 2, label: 'Rejected', icon: 'face', color: 'warn'},
  // {indexStatus: 3, label: 'Signed, pending paiement'},
  // {indexStatus: 4, label: 'Done'},
]
export const StatusQuotesInvoice =
[
  {indexStatus: 100, label: 'Sent'},
  {indexStatus: 101, label: 'Paid'},
]

// export class Address {
//   address: string = '';
//   city: string = '';
//   state: string = '';
//   zip: string = '';
// }
