'use strict';

var fs = require('fs');
var path = require('path');

var Plugin = require('broccoli-plugin');

function WorkerManifest(options) {
  Plugin.call(this, [], { persistentOutput: true });
  this.options = options;
}

module.exports = WorkerManifest;

WorkerManifest.prototype = Object.create(Plugin.prototype);
WorkerManifest.prototype.constructor = WorkerManifest;

WorkerManifest.prototype.build = function() {
  var manifestPath = path.join(this.outputPath, 'worker-manifest.js');

  if (!fs.existsSync(manifestPath)) {
    var content = 'export default ' + JSON.stringify(this.options.workerPaths, null, 2) + ';';
    fs.writeFileSync(manifestPath, content, 'utf-8');
  }
};
