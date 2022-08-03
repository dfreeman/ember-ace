import EmberRouter from '@ember/routing/router';
import config from 'test-app-classic/config/environment';

export default class Router extends EmberRouter {
  public location = config.locationType;
  public rootURL = config.rootURL;
}

Router.map(function () {
  // routes go here
});
