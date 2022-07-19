import { findElementWithAssert } from 'ember-cli-page-object';

export default {
  /**
   * The type of annotation this is, typically one of 'info', 'warning', or 'error'.
   */
  type: {
    isDescriptor: true,
    get() {
      const classes = findElementWithAssert(this).attr('class').split(/\s+/);
      return classes[classes.length - 1].replace(/^ace_/, '');
    },
  },

  /**
   * The 0-indexed row number of this annotation.
   */
  row: {
    isDescriptor: true,
    get() {
      const el = findElementWithAssert(this)[0];
      return [].slice.call(el.parentElement.children).indexOf(el);
    },
  },
};
