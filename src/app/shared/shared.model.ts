export class Search {
  isQuoteAssignedToMe: boolean = false;
  orderBy: string = '';
  search: string = '';
  quoteType: string = '';
  quoteId: string = '';
  userId: string = '';
  assignedToId: string = '';
  projectId: string = '';
  parentQuoteId: string = '';
  isExternalUser: boolean = true;
  isExpense: boolean = false;
  typeQuote: string = '';
  year: number = 0;
  isSigned: boolean = false;
};



export class PaginationData {
  currentPage: number = 1;
  itemsPerPage: number = 0;
  totalItems: number = 0;
};
