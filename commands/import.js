const fs = require('fs');
const path = require('path');

const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

const inquirer = require('inquirer');


const { checkConfig } = require('../lib/utils');
const {
  getSessions,
  getSpeakersFromSessions,
} = require('../lib/sessionize');
const {
  importSessions,
  importSpeakers,
} = require('../lib/hoverboard');

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

const preview = async (yes = false) => {
  const configError = await checkConfig();

  if (configError) {
    console.log('Config error. Run init again');
    return;
  }

  const allSessions = await getSessions();

  let sessions = [];
  if (!yes) {
    const answers = await inquirer.prompt([{
      type: 'checkbox',
      name: 'sessions',
      message: `Select from ${allSessions.length} sessions to import`,
      choices: allSessions.map(session => ({
        name: `${session.title} [${session.speakers.map(s => s.name).join()}]`,
        value: session,
        checked: true,
      })),
      pageSize: 15,
    }]);

    sessions = answers.sessions; // eslint-disable-line

    if (sessions.length === 0) {
      console.log('You selected nothing :(');
      return;
    }
  } else {
    sessions = allSessions;
  }

  const speakers = await getSpeakersFromSessions(sessions);

  const speakerIdMapping = await importSpeakers(speakers);

  await importSessions(sessions, speakerIdMapping);
  // console.log(speakerIdMapping);
};

module.exports = (cmd) => {
  preview(!!cmd.yes)
    .catch(err => console.error(err));


  // inquirer
  //   .prompt(initialQuestions)
  //   .then(answers => saveConfig(JSON.stringify(answers, null, '  ')))
  //   .then(() => console.log('Config was saved successfully.'))
  //   .catch(console.error);
};
