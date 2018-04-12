'use strict'

import assign from 'lodash/assign'

const defaultConfigs = {
  env: 'default',
  app_url: 'http://192.168.0.18:6080',
  socket_url: 'http://192.168.0.18:6080',
  api_url: 'http://192.168.0.18:6080/apiv2',
  supervisor_api_url: 'http://192.168.0.18:60080',
  session: {
    refresh_interval: 1000 * 60 * 30
  },
  dashboard: {
    upandrunningSign: true
  },
  agentBinary:{
    url: 'https://s3.amazonaws.com/theeye.agent/TheEyeWinServiceInstaller.zip',
    name: 'TheEyeWinServiceInstaller.zip'
  }
}

const configs = {
  default: defaultConfigs,

  local: assign({}, defaultConfigs, {
    env: 'local',
    dashboard: {
      upandrunningSign: false
    }
  }),

  // cloud development enviroment
  development : assign({}, defaultConfigs, {
    env: 'development',
    app_url: 'https://development.theeye.io',
    socket_url: 'https://development.theeye.io:443',
    api_url: 'https://development.theeye.io/apiv2',
    supervisor_api_url: 'https://supervisor.development.theeye.io',
  }),

  // cloud staging enviroment
  staging : assign({}, defaultConfigs, {
    env: 'staging',
    app_url: 'https://staging.theeye.io',
    socket_url: 'https://staging.theeye.io',
    api_url: 'https://staging.theeye.io/apiv2',
    supervisor_api_url: 'https://supervisor.staging.theeye.io',
  }),

  // cloud production enviroment
  production : assign({}, defaultConfigs, {
    env: 'production',
    app_url: 'https://app.theeye.io',
    socket_url: 'https://app.theeye.io:443',
    api_url: 'https://app.theeye.io/apiv2',
    supervisor_api_url: 'https://supervisor.theeye.io',
  })
}

module.exports = configs
