import { Form } from '../picture/form/form.model';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';
// import { Project } from '../project/project.model';
import { Companie } from '../companie/companie.model';
import { Quote } from '../quote/quote.model';


export class PaiementQuote {
  _id: string = '';
  ownerCompanies: Companie[] = []
  quotes: Quote[] = []
  createdBy: User[] = []
  userDebiteds: User[] = []
  // projects: Project[] = []
  datePaiement: Date = new Date();
  datePaiementString: string = '';
  amount: number = 0;
  type: string = 'cash';
  title: string = '';
  isGooplusPaiement: boolean = false;
  isPaid: boolean = true;
  isExpense: boolean = false;
  editModeDate: boolean = false;
  stripe: Stripe = new Stripe()
}
export class Stripe {
  cusId: string = '';
  isSubscription: boolean = false;
  charge: Charge = new Charge()
}
export class Charge {
  balance_transaction: string = '';
  amount: number;
  created: number
  currency: string = '';
  customer: string = '';
  id: string = '';
  status: string = '';
  source: Source = new Source()
}

export class Source {
  address_city: string = '';
  address_country: string = '';
  address_line1: string = '';
  address_line1_check: string = '';
  address_line2: string = '';
  address_state: string = '';
  address_zip: string = '';
  address_zip_check: string = '';
  brand: string = '';
  country: string = '';
  customer: string = '';
  cvc_check: string = '';
  dynamic_last4: string = '';
  exp_month: string = '';
  exp_year: string = '';
  fingerprint: string = '';
  funding: string = '';
  id: string = '';
  last4: string = '';
}


// stripe: {
//   charge:{
//     balance_transaction: string = '';
//     amount: {type: Number},
//     created: {type: Number},
//     currency: string = '';
//     customer: string = '';
//     id: string = '';
//     status: string = '';
//     source: {
//       address_city: string = '';
//       address_country: string = '';
//       address_line1: string = '';
//       address_line1_check: string = '';
//       address_line2  : string = '';
//       address_state: string = '';
//       address_zip: string = '';
//       address_zip_check: string = '';
//       brand: string = '';
//       country: string = '';
//       customer  : string = '';
//       cvc_check  : string = '';
//       dynamic_last4: string = '';
//       exp_month  : string = '';
//       exp_year: string = '';
//       fingerprint  : string = '';
//       funding: string = '';
//       id: string = '';
//       last4: string = '';
//     }
//
//   },
//   cusId: string = '';
//   isSubscription:{type: Boolean, default: [false]},
//   planDetail:{
//     plan:{type: String, default: ['']},
//     current_period_end:{type: Date}
//   }
// }

export class StripeCustomer {
  id: string = '';
  account_balance: number = 0;
  created: string = '';
  default_source: string = '';
  description: string = '';
  email: string = '';
  sources: Sources = new Sources()
  subscriptions: Subscription = new Subscription()
}

export class Sources {
  data: DataSource[] = []
}

export class DataSource {
  id: string = '';
  object: string = 'card';
  address_city: string = '';
  address_country: string = '';
  address_line1: string = '';
  address_state: string = '';
  address_zip: string = '';
  address_line2: string = '';
  brand: string = '';
  country: string = '';
  exp_month: string = '';
  exp_year: string = '';
  last4: string = '';
  funding: string = '';
  cvc: string = '';
}

export class Subscription {
  data: DataSubscription[] = []
}

export class DataSubscription {
  id: string = '';
  created: string = '';
  current_period_end: string = '';
  current_period_start: string = '';
  items: Items = new Items()
}


export class Items {
  data: DataItem[] = []
}

export class DataItem {
  id: string = '';
  created: string = '';
  plan: Plan = new Plan()
}

export class Plan {
  id: string = '';
  amount: number = 0;
  created: string = '';
  currency: string = '';
  interval: string = '';
  interval_count: number = 0;
}
