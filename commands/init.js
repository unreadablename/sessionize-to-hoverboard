const fs = require('fs');
const path = require('path');

const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

const inquirer = require('inquirer');

/**
 * Check if file exists and is readable
 * @param {String} filepath Filepath to check
 */
const checkFileExists = filepath => new Promise((resolve, reject) => {
  fs.access(filepath, fs.constants.R_OK, (err) => {
    if (err) {
      reject(new Error(err.code === 'ENOENT' ? 'File does not exist' : 'File is not readable'));
      return;
    }

    resolve();
  });
});

function validateServiceAccount(value) {
  const done = this.async();

  const filepath = path.resolve(process.cwd(), value);
  checkFileExists(filepath)
    .then(() => done(null, true))
    .catch(err => done(err.message));
}

const validateSessionizeEndpoint = (value) => {
  // try to make request
  return true;
};

const saveConfig = config => writeFile(
  path.resolve(process.cwd(), 'sessionize.json'),
  config,
  { encoding: 'utf-8' },
);

const initialQuestions = [
  {
    type: 'input',
    name: 'serviceAccount',
    message: 'Where is located you service account file?',
    default: './serviceAccount.json',
    validate: validateServiceAccount,
  },
  {
    type: 'input',
    name: 'sessionizeEndpoint',
    message: 'Sessionize API Endpoint',
    default: 'https://sessionize.com/api/v2/jl4ktls0/view/',
    validate: validateSessionizeEndpoint,
  },
];

module.exports = () => {
  inquirer
    .prompt(initialQuestions)
    .then(answers => saveConfig(JSON.stringify(answers, null, '  ')))
    .then(() => console.log('Config was saved successfully.'))
    .catch(console.error);
};
