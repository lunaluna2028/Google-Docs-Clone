import Quill from 'quill';
import inputIcon from './input.png';


export function registerInputBoxButtonOnly() {
    const icons = Quill.import('ui/icons') as any;
    icons['input-container'] = `<img src="${inputIcon}" style="width: 18px; height: 18px;" />`;
  }