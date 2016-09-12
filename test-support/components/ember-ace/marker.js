import { findElementWithAssert } from 'ember-cli-page-object';

export default {
  /**
   * The type of marker this is, as designated by the specified `class` for the marker.
   */
  type: {
    isDescriptor: true,
    get() {
      return findElementWithAssert(this).attr('class').split(/\s+/)[0];
    }
  },

  /**
   * The number of segments this marker is composed from. Typically a marker will have
   * one segment per document line that it spans.
   */
  segmentCount: {
    isDescriptor: true,
    get() {
      const type = this.type;
      let sibling = findElementWithAssert(this)[0];
      let count = 1;

      while ((sibling = sibling.nextElementSibling)) {
        if (!sibling.classList.contains(type) || sibling.classList.contains('ace_start')) {
          break;
        }
        count++;
      }

      return count;
    }
  }
};
