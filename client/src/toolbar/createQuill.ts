// src/editor/createQuill.ts
import Quill from 'quill'
import QuillResizeModule from 'quill-resize-module'
import { getToolbarOptions } from '../constants';
import QuillTableBetter from 'quill-table-better';
import 'quill-table-better/dist/quill-table-better.css';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import MyInputBoxModule from "@/toolbar/quill-input-box/MyInputBoxModule";
import '@/toolbar/quill-input-box';
import { registerInputBoxButtonOnly } from '@/toolbar/quill-input-box/registerInputBox';



registerInputBoxButtonOnly();

(window as any).katex = katex;

Quill.register({'modules/table-better': QuillTableBetter }, true);
Quill.register('modules/imageResize', QuillResizeModule)
Quill.register('modules/input-container', MyInputBoxModule);

export function createQuillEditor(wrapper: HTMLDivElement, isAdmin: boolean): Quill {
  wrapper.innerHTML = ''

  const editor = document.createElement('div')
  wrapper.append(editor)

  const quill = new Quill(editor, {
    theme: 'snow',
    modules: {
      toolbar: getToolbarOptions(isAdmin),
      formula: true,
      imageResize: {
        displaySize: true
      },
      'table-better': {
        language: 'en_US',
        menus: ['column', 'row', 'merge', 'table', 'cell', 'wrap', 'copy', 'delete'],
        toolbarTable: true,
        toolbarButtons: {
          whiteList: [
            'bold', 'italic', 'underline', 'strike',
            'size', 'color', 'background', 'font',
            'list', 'header', 'align', 'link', 'image',
            'input-container'  // ✅ 여기에 추가!
          ],
          singleWhiteList: [
            'link', 'image', 'input-container' // ✅ 단일 셀도 허용되게!
          ]
        }
      },
      keyboard: {
        bindings: QuillTableBetter.keyboardBindings
      },
      'input-container': {},
    },
  })

  quill.disable()

  return quill
}
