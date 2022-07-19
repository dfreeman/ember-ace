/* global ace */

import workerManifest from 'ember-ace/worker-manifest';

export default ace;

export const Tokenizer = ace.require('ace/tokenizer').Tokenizer;
export const Range = ace.require('ace/range').Range;

export const TextMode = ace.require('ace/mode/text').Mode;
export const TextHighlightRules = ace.require(
  'ace/mode/text_highlight_rules'
).TextHighlightRules;

const config = ace.require('ace/config');
Object.keys(workerManifest).forEach((key) => {
  config.setModuleUrl(key, workerManifest[key]);
});
