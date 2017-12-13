import { Form } from '../../../picture/form/form.model';
import { User } from '../../../user/user.model';

export class DrawingSignature {
  // isSigned: boolean = false;
  namePicture: string = '';
  base64: string = '';
  base64Temp: string = '';
  dateDrawing: Date = new Date()
  users: User[] = [];
  // backgroundForms: Form[] = []
}
