if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/create-decorator.production.min.js');
} else {
  module.exports = require('./lib/create-decorator.development.js');
}
