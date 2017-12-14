export class Search {
  // isQuoteAssignedToMe: boolean = false;
  orderBy: string = '';
  search: string = '';
  quoteType: string = '';
  quoteId: string = '';
  userId: string = '';
  // assignedToId: string = '';
  projectId: string = '';
  parentQuoteId: string = '';
  isExternalUser: boolean = true;
  isExpense: boolean = false;
  typeQuote: string = '';
  year: number = 0;
  isFromAutocomplete: boolean = false;
  // isSigned: boolean = false;
  statusQuote: string = '';
};



export class PaginationData {
  currentPage: number = 1;
  itemsPerPage: number = 0;
  totalItems: number = 0;
};

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export class CustomFormControls {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.pattern(EMAIL_REGEX)])
}
