import { Form } from '../picture/form/form.model';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';
// import { Project } from '../project/project.model';


export class PaiementQuoteGraph {
  amountTotal: number = 0;
  _id: Id = new Id();

}

export class Id {
  month: number = 0;
  year: number = 0;
}

export class EmptyRow {
  data= [0, 0, 0, 0, 0, 0, 0, 0, 0 , 0, 0, 0];
  label= '';
  year= 0;
  ready= false;
}
