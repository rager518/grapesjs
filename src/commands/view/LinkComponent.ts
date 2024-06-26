import { isArray } from 'underscore';
import Component from '../../dom_components/model/Component';
import { CommandObject } from './CommandAbstract';

const command: CommandObject<{ component?: Component }> = {
  run(ed, s, opts = {}) {
    const removed: Component[] = [];
    let components = opts.component || ed.getSelectedAll();
    components = isArray(components) ? [...components] : [components];

    components.filter(Boolean).forEach(component => {
      if (!component.get('linkable')) {
        return this.em.logWarning('The element is not linkeable', {
          component,
        });
      }

      removed.push(component);
      const cmp = component.delegate?.remove?.(component) || component;
      let parent = cmp.parent();
      let value = `<a href="">${cmp.toHTML()}</a>`;
      parent?.components().add(value);
      cmp.remove();
    });

    ed.selectRemove(removed);

    return removed;
  },
};
export default command;
