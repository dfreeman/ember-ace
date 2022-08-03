import { config } from 'ace-builds';

// Load language tools for autocomplete
import 'ace-builds/src-noconflict/ext-language_tools';

// Load required themes
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-ambiance';
import 'ace-builds/src-noconflict/theme-chaos';

// Load the JS mode
import 'ace-builds/src-noconflict/mode-javascript';

// Load the JS worker's URL and tell Ace where to find it.
import * as jsWorker from 'ace-builds/src-noconflict/worker-javascript?resource';

config.setModuleUrl('ace/mode/javascript_worker', jsWorker);
