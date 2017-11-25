
export class Right {
  _id: string = '';

  detailRight: DetailRight = new DetailRight()
}

export class DetailRight {
  nameRight: string = '';
  permissions: Permission[] = []
}

export class Permission {
  namePermission: string = '';
  access: Access[] = []
}
export class Access {
  typeAccess: string = '';
}

export const TypeRights = [
  // {name : 'Project', value: 'project', typeAccess:
  //   [{value:'read',name:'Read'},{value:'write',name:'Write'},{value:'notification',name:'Get notification'}]},
  {name : 'Product', value: 'product', typeAccess:
    [{value:'read',name:'Read'},{value:'write', name:'Write'}]},
  {name : 'Quote', value: 'quote', typeAccess:
    [
      {value:'read',name:'Read'},
      {value:'write', name:'Write'},
      // {value:'notification', name:'Get notification'},
      {value:'signature', name:'Signature'},
      {value:'drawing', name:'Drawing'},
      {value:'template', name:'Template'},
    ]},
  // {name : 'Reporting', value: 'reporting', typeAccess:
  //   [{value:'read',name:'Read'},{value:'write', name:'Write'}]},
  {name : 'Companie', value: 'companie', typeAccess:
    [{value:'read',name:'Read'},{value:'write',name:'Write'}]},
  {name : 'User', value: 'user', typeAccess:
    [{value:'read',name:'Read'},{value:'write', name:'Write'}]},
  {name : 'Paiement', value: 'paiementQuote', typeAccess:
    [{value:'read',name:'Read'},{value:'write', name:'Write'}]},
  // {name : 'Task', value: 'task', typeAccess:
  //   [{value:'read',name:'Read'},{value:'write', name:'Write'}]},
  // {name : 'userCalendar', value: 'userCalendar', typeAccess:
  //   [{value:'read',name:'Read'},{value:'write', name:'Write'}]},
  // {name : 'Plan', value: 'plan', typeAccess:
  //   [{value:'read',name:'Read'},{value:'write', name:'Write'}]},
  {name : 'Right', value: 'right', typeAccess:
    [{value:'read',name:'Read'},{value:'write', name:'Write'}]},
  // {name : 'Expense', value: 'expense', typeAccess:
  //   [{value:'read',name:'Read'},{value:'write', name:'Write'}]},
  // {name : 'Comment', value: 'comment', typeAccess:
  //   [{value:'read',name:'Read'},{value:'write', name:'Write'}]},
]
