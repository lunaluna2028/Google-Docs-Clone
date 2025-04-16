// 커스텀 input 블롯 정의

import Quill from 'quill';
import './styles.css'; 

// Quill 내부에서 Embed 타입 불러오기
const Container = Quill.import('blots/container');
const Block = Quill.import('blots/block');
const BlockEmbed = Quill.import('blots/block/embed');
const ImageBlot = Quill.import('formats/image'); // Quill 내장 이미지
const FormulaBlot = Quill.import('formats/formula');
const Table = Quill.import('modules/table-better/table');
const TableCell = Quill.import('modules/table-better/table-cell');
const TableRow = Quill.import('modules/table-better/table-row');



// 새로운 Blot 정의
export class InputContainerBlot extends (Container as any) {
  static blotName = 'input-container';         // 툴바에서 사용할 이름
  static tagName = 'div';              // HTML 태그로 어떤 걸 만들지
  static className = 'custom-input-container'; // 클래스 이름 (스타일링용)

  
  static allowedChildren = [
    Block,
    BlockEmbed,
    Image,
    FormulaBlot,
    Table,
    TableRow,
    TableCell,
  ].filter(Boolean);

  // HTML 엘리먼트를 어떻게 만들지 정의
  static create(value: any) {
    const node = super.create() as HTMLDivElement;
    node.classList.add(this.className);
    node.setAttribute('data-placeholder', value || '입력 영역');
  
    // Quill의 기본 paragraph 블록을 넣기 (텍스트 입력 가능 영역 확보)
    const p = document.createElement('p');
    p.innerHTML = '<br>'; // 빈 줄 하나
    node.appendChild(p);
  
    return node;
  }
}

// Quill에게 이 blot을 등록
Quill.register(InputContainerBlot, true);