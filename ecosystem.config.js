/* eslint-disable camelcase */
module.exports = {
  apps: [{
    name: 'app',
    script: './dist/src/cluster.js',
    instances: '1',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
