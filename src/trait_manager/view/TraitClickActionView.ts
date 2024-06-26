import TraitView from './TraitView';

export default class TraitClickActionView extends TraitView {
  getInputEl() {
    const { model } = this;

    const el: HTMLElement = document.createElement('div');
    el.innerHTML = `
            <div class="tab-container gjs-one-bg gjs-two-color">
                <div class="tab-icons gjs-pn-buttons gjs-radio-items">
                    <div class="tab-icon" title="Go to URL"> 
                        <input type="radio" class="gjs-sm-radio" name="link-type" value="url" checked="">
                        <label class="tab-button gjs-pn-btn gjs-four-color" data-tab="url"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path d="M16 6h-3v1.9h3a4.1 4.1 0 1 1 0 8.2h-3V18h3c3.31 0 6-2.69 6-6 0-3.32-2.69-6-6-6M3.9 12A4.1 4.1 0 0 1 8 7.9h3V6H8c-3.31 0-6 2.69-6 6s2.69 6 6 6h3v-1.9H8c-2.26 0-4.1-1.84-4.1-4.1M8 13h8v-2H8v2z"></path></svg></label>
                    </div>
                    <div class="tab-icon" title="Go to next step">
                        <input type="radio" class="gjs-sm-radio" name="link-type" value="page">
                        <label class="tab-button gjs-pn-btn" data-tab="page" ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12c0 1.1-.9 2-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m5 2H6v16h12v-9h-7V4z"></path></svg></label>
                    </div>
    
                </div>
                <div class="tab-content">
                    <div class="tab-panel active" data-tab="url">
                        <div class="gjs-trt-trait">
                            <div class="gjs-field gjs-field-text">
                                <input name="url" class="gjs-url" placeholder="eg. https://google.com"/>
                            </div>
                        </div>
                    </div>

                    <div class="tab-panel" data-tab="page">
                        <div class="gjs-trt-trait gjs-trt-trait--select">
                            <div class="gjs-field-wrp gjs-field-wrp--select" data-input="">
                                <div class="gjs-field gjs-field-select">
                                    <div data-input="">
                                        <select name="page" class="gjs-page">
                                            <option value="" selected disabled hidden>选择...</option>
                                            <option value="{-NEXTURL-}" >下一步</option>
                                        </select>
                                    </div>
                                    <div class="gjs-sel-arrow">
                                        <div class="gjs-d-s-arrow"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                .tab-icons {
                    margin: 0 0 15px 0;
                }
                .gjs-sm-radio + label {
                    padding: 5px 10px;
                    border-color: transparent;
                    border-width: 2px;
                    transition: color 0.25s, border-color 0.25s;
                    border-bottom: 2px solid transparent;
                }
                .gjs-sm-radio:checked + label {
                    color: #d278c9;
                    border-color: #d278c9;
                }
                .tab-icon {
                    flex: 1 1 auto;
                    text-align: center;
                }
            </style>
        `;

    const tabContainer = el.querySelector<HTMLElement>('.tab-container');
    if (tabContainer) {
      new TabSystem(tabContainer, model.target.getAttributes()['link-type'] ?? 'url');
    }

    return el as any;
  }

  onChange(event: Event): void {
    const elInput: HTMLElement = this.getInputElem();
    const component = this.getComponent();
    const typeInput = elInput.querySelector<HTMLElement>('.gjs-four-color');
    let href = '';
    if (typeInput) {
      let attributes: any = {};
      const type = typeInput.dataset.tab;
      switch (type) {
        case 'url':
          const valUrl = elInput.querySelector<HTMLInputElement>('input[name="url"]')?.value;
          if (valUrl) {
            href = valUrl;
          }
          attributes['href'] = valUrl;
          break;
        case 'page':
          const valPage = elInput.querySelector<HTMLSelectElement>('select[name="page"]')?.value;
          if (valPage) {
            href = valPage;
          }
          attributes['href'] = valPage;
          break;
      }
      attributes['link-type'] =
        elInput.querySelector<HTMLInputElement>('input[name="link-type"]:checked')?.value ?? false;

      component.setAttributes(attributes);
    }
  }

  postUpdate(): void {
    const elInput: HTMLElement = this.getInputElem();
    const component = this.getComponent();

    const attributes = component.getAttributes();
    const type = attributes['link-type'] || 'url';
    const typeButton = elInput.querySelector<HTMLElement>(`.tab-button[data-tab="${type}"]`);

    const fields = ['url', 'page'];

    fields.forEach(function (field) {
      const input = elInput.querySelector<HTMLInputElement>('.gjs-' + field);
      if (input && attributes['href']) {
        input.value = attributes['href'];
      }
    });

    const tabInput = elInput.querySelector<HTMLInputElement>(
      `input[name="link-type"][value="${attributes['link-type']}"]`
    );
    if (tabInput) {
      elInput.querySelectorAll<HTMLInputElement>('input[name="link-type"]').forEach(function (radio) {
        radio.checked = radio.value == attributes['link-type'];
        radio.dispatchEvent(new CustomEvent('change'));
      });

      const tabButton = tabInput?.parentNode?.querySelector('.tab-button');
      if (tabButton) {
        tabButton.dispatchEvent(new CustomEvent('click'));
      }
    }

    if (typeButton) {
      typeButton.dispatchEvent(new CustomEvent('click'));
    }
  }
}

class TabSystem {
  private buttons: HTMLButtonElement[];
  private panels: HTMLElement[];

  constructor(private container: HTMLElement, startTab: string) {
    this.buttons = Array.from(container.querySelectorAll('.tab-button'));
    this.panels = Array.from(container.querySelectorAll('.tab-panel'));

    this.buttons.forEach(button => {
      button.addEventListener('click', this.onTabClick);
      const svg = button.querySelector('svg');
      if (svg) {
        svg.addEventListener('click', (event: MouseEvent) => {
          const label = (event.target as HTMLElement).closest('label');
          if (label) {
            label.click();
          }
        });
      }
    });

    this.showTab(startTab);
  }

  private onTabClick = (event: MouseEvent) => {
    const target = event.target as HTMLButtonElement;
    const tab = target.dataset.tab;

    if (!tab) return;

    this.showTab(tab);

    const radio = target.parentNode?.querySelector<HTMLInputElement>('.gjs-sm-radio');
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new CustomEvent('change'));
    }
  };

  private showTab = (tab: string) => {
    this.buttons.forEach(button => {
      button.classList.toggle('gjs-four-color', button.dataset.tab === tab);
    });

    this.panels.forEach(panel => {
      panel.style.display = panel.dataset.tab === tab ? '' : 'none';
      panel.classList.toggle('active', panel.dataset.tab === tab);
    });
  };
}
