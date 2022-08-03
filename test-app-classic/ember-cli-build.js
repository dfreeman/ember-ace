'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      webpack: {
        module: {
          rules: [
            {
              resourceQuery: /resource/,
              type: 'asset/resource',
            },
          ],
        },
      },
    },
  });

  return app.toTree();
};
