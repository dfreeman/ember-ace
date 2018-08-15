## 2.0.0 (August 14, 2018)
### Changed
- Updated to the latest `ace-builds` release
- Updated the page object in `addon-test-support` to use the new `collection` API (available in 1.14 and higher)

### Upgrade Notes
The main notable change with the newer Ace version is that autocomplete items returned from the `suggestCompletions` action are subject to [different sorting rules than in previous versions](https://github.com/ajaxorg/ace/blob/b7554f698fbae97ab410ae97a7b986d40cbd36fb/lib/ace/autocomplete.js#L462-L465).

See the Ember CLI Page Object documentation for details on the changes to the `collection` API, comparing [the old API](http://ember-cli-page-object.js.org/docs/v1.13.x/api/collection) to [the new one](http://ember-cli-page-object.js.org/docs/v1.14.x/api/collection).
