/* eslint-env node */

'use strict';

module.exports = {
  name: 'ember-ace',

  options: {
    nodeAssets: {
      'ace-builds': function() {
        return {
          srcDir: 'src-noconflict',
          import: calculateImports(this.aceOptions),
          public: calculatePublicFiles(this.aceOptions)
        };
      }
    }
  },

  included: function(parent) {
    this.aceOptions = (parent.options || {}).ace || {};
    this._super.included.apply(this, arguments);
  },

  treeForAddon: function(tree) {
    var WorkerManifest = require('./lib/worker-manifest');
    var manifest = new WorkerManifest({
      workerPaths: calculateWorkerPaths(this.aceOptions)
    });

    var merged = require('broccoli-merge-trees')([tree, manifest]);
    return this._super.treeForAddon.call(this, merged);
  }
};

function calculateImports(options) {
  var imports = ['ace.js'];
  ['mode', 'theme', 'ext', 'keybinding'].forEach(function(type) {
    var wanted = options[type + 's'];
    if (!wanted) return;
    wanted.forEach(function(name) {
      imports.push(type + '-' + name + '.js');
    });
  });
  return imports;
}

function calculatePublicFiles(options) {
  if (options.workers) {
    return {
      destDir: 'assets/ace',
      include: options.workers.map(function(name) {
        return 'worker-' + name + '.js';
      })
    };
  }
}

function calculateWorkerPaths(options) {
  var workers = {};
  if (options.workers) {
    var workerPath = options.workerPath || '/assets/ace';
    options.workers.forEach(function(name) {
      workers['ace/mode/' + name + '_worker'] = workerPath + '/worker-' + name + '.js';
    });
  }
  return workers;
}
