declare global {
  const ace: typeof import('ace-builds');
}

// @ts-expect-error: will be dealt with when the build process is overhauled
import workerManifest from 'ember-ace/worker-manifest';

export default ace;

const config = ace.require('ace/config');
Object.keys(workerManifest).forEach((key) => {
  config.setModuleUrl(key, workerManifest[key]);
});
