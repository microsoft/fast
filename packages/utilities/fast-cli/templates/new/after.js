// Use "after" task to ask user to install deps.

const {execSync} = require('child_process');

function isAvailable(bin) {
  try {
    execSync(bin + ' -v', {stdio: 'ignore'});
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = async function({
  unattended, here, prompts, run, properties, notDefaultFeatures, ansiColors
}, {
  // for testing
  _isAvailable = isAvailable,
  _log = console.log
} = {}) {
  const c = ansiColors;
  let depsInstalled = false;

  if (!unattended) {
    const choices = [
      {title: 'No'},
      {value: 'npm', title: 'Yes, use npm'}
    ];

    if (_isAvailable('yarn')) {
      choices.push({value: 'yarn', title: 'Yes, use yarn'});
    }

    if (_isAvailable('pnpm')) {
      choices.push({value: 'pnpm', title: 'Yes, use pnpm'});
    }

    const result = await prompts.select({
      message: 'Do you want to install npm dependencies now?',
      choices
    });

    if (result) {
      await run(result, ['install']);
      depsInstalled = true;
    }
  }

  _log(`\n${c.underline.bold('Get Started')}`);
  if (!here) _log('cd ' + properties.name);
  if (!depsInstalled) _log('npm install');
  _log('npm start\n');
};