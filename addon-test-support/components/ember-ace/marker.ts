import { Component } from 'ember-cli-page-object/-private';
import { findElementWithAssert } from 'ember-cli-page-object/extend';
import { getter } from 'ember-cli-page-object/macros';

export type Marker = Component<{
  type: string;
}>;

export default {
  /**
   * The type of marker this is, as designated by the specified `class` for the marker.
   */
  type: getter(function (this: Marker) {
    return findElementWithAssert(this).attr('class')!.split(/\s+/)[0]!;
  }),

  /**
   * The number of segments this marker is composed from. Typically a marker will have
   * one segment per document line that it spans.
   */
  segmentCount: getter(function (this: Marker) {
    const type = this.type;
    let sibling: Element | undefined = findElementWithAssert(this)[0];
    let count = 1;

    while ((sibling = sibling?.nextElementSibling ?? undefined)) {
      if (
        !sibling.classList.contains(type) ||
        sibling.classList.contains('ace_start')
      ) {
        break;
      }
      count++;
    }

    return count;
  }),
};
