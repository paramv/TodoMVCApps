var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'node-ko'
    },
    port: 3000,
    db: 'mongodb://localhost/node-ko-development'
    
  },

  test: {
    root: rootPath,
    app: {
      name: 'node-ko'
    },
    port: 3000,
    db: 'mongodb://localhost/node-ko-test'
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'node-ko'
    },
    port: 3000,
    db: 'mongodb://localhost/node-ko-production'
    
  }
};

module.exports = config[env];
