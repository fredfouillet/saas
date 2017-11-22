import { Form } from '../../../picture/form/form.model';
import { User } from '../../../user/user.model';

export class Drawing {
  base64: string = '';
  dateDrawing: Date = new Date()
  users: User[] = [];
  backgroundForms: Form[] = []
}
