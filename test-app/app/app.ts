import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'test-app/config/environment';

import './ace-config';

export default class App extends Application {
  public modulePrefix = config.modulePrefix;
  public podModulePrefix = config.podModulePrefix;
  public Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
