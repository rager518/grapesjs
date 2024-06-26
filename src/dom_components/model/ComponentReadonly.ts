import Component from './Component';
import { toLowerCase } from '../../utils/mixins';

const type = 'readonly';

export default class ComponentReadonly extends Component {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type: type,
      tagName: type,
      copyable: false,
      highlightable: false,
      //draggable: false,
      //editable: false,
      //locked: true,
      //selectable: false,
    };
  }

  static isComponent(el: HTMLScriptElement) {
    return toLowerCase(el.tagName) === type;
  }
  initialize(props: any, opts: any) {
    super.initialize(props, opts);
    this.__checkInnerChilds();
  }

  __checkInnerChilds() {
    const disableChild = (child: Component) => {
      child.set({
        locked: true,
        layerable: false,
      });
    };

    this.forEachChild(disableChild);
  }
}
