// https://www.npmjs.com/package/ng2-toastr
import {ToastOptions} from 'ng2-toastr';

export class CustomOption extends ToastOptions {
  animate = 'fade';
  newestOnTop = false;
  maxShown = 1;
  toastLife = 700;
  showCloseButton = false;
}
