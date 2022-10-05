const ghpages = require('gh-pages');
const fs = require('fs-extra');

fs.copySync('assets/', 'dist/assets/');

ghpages.publish('dist');
