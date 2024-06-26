import { isUndefined } from 'underscore';
import $ from '../../utils/cash-dom';
import Input from './Input';

const getColor = (color: any) => {
  const name = color.getFormat() === 'name' && color.toName();
  const cl = color.getAlpha() == 1 ? color.toHexString() : color.toRgbString();
  return name || cl.replace(/ /g, '');
};

export default class InputColor extends Input {
  colorEl?: any;
  movedColor?: string;
  noneColor?: boolean;
  model!: any;

  template() {
    const ppfx = this.ppfx;
    return `
      <div class="${this.holderClass()}"></div>
      <div class="${ppfx}field-colorp">
        <div class="${ppfx}field-colorp-c" data-colorp-c>
          <div class="${ppfx}checker-bg">

          </div>
        </div>
      </div>
    `;
  }

  inputClass() {
    const ppfx = this.ppfx;
    return `${ppfx}field ${ppfx}field-color`;
  }

  holderClass() {
    return `${this.ppfx}input-holder`;
  }

  remove() {
    super.remove();
    return this;
  }

  handleChange(e: any) {
    e.stopPropagation();
    const { value } = e.target;
    if (isUndefined(value)) return;
    this.__onInputChange(value);
  }

  __onInputChange(val: string) {
    const { model, opts } = this;
    const { onChange } = opts;
    let value = val;
    const colorEl = this.getColorEl();

    // Check the color by using the ColorPicker's parser
    if (colorEl) {
      const color = value;
      color && (value = color);
    }

    onChange ? onChange(value) : model.set({ value }, { fromInput: 1 });
  }

  /**
   * Set value to the model
   * @param {string} val
   * @param {Object} opts
   */
  setValue(val: string, opts: any = {}) {
    const { model } = this;
    const def = !isUndefined(opts.def) ? opts.def : model.get('defaults');
    const value = !isUndefined(val) ? val : !isUndefined(def) ? def : '';
    const inputEl = this.getInputEl();
    const colorEl = this.getColorEl();
    const valueClr = value != 'none' ? value : '';
    inputEl.value = value;
    colorEl.get(0).style.backgroundColor = valueClr;

    // This prevents from adding multiple thumbs in spectrum
    if (opts.fromTarget || (opts.fromInput && !opts.avoidStore)) {
      this.noneColor = value == 'none';
      this.movedColor = valueClr;
    }
  }

  /**
   * Get the color input element
   * @return {HTMLElement}
   */
  getColorEl() {
    if (!this.colorEl) {
      const colorEl = $(`<div class="${this.ppfx}field-color-picker"><input type='color' value='#ffffff'/></div>`);
      this.movedColor = '';
      this.$el.find('[data-colorp-c]').append(colorEl);

      this.colorEl = colorEl;
    }
    return this.colorEl;
  }

  render() {
    Input.prototype.render.call(this);
    // This will make the color input available on render
    this.getColorEl();
    return this;
  }
}
