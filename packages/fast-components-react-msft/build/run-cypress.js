const spawn = require('child_process').spawn
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const WebpackDevServer = require('webpack-dev-server');
const envs = require('dotenv').config();
const cypress = require('cypress');

// Validate environment variables are secure and properly set
if(envs.error) {
  if(process.env.CYPRESS_RECORD_KEY.length == 0)
    throw envs.error;
  else
    console.log('Need to add CYPRESS_RECORD_KEY to CI');
}
console.log(envs.parsed);

// Start Webpack development server for the application as required by Cypress
function startServer() {
  return new Promise((resolve, reject) => {
    new WebpackDevServer(webpack(webpackConfig), {})
    .listen(7001, 'localhost', function(err) {
      resolve()
    }).on('error', (error) => {
      reject(error)
    })
  })
}

var server = startServer();

server.then(function() {

  setTimeout(() => {
    const cypress = spawn("cypress", ["run", "--record", "--key", process.env.CYPRESS_RECORD_KEY], {stdio: "inherit"});
    console.log(cypress.stdout);
  }, 10000);
})
