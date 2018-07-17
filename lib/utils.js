const fs = require('fs');
const path = require('path');

const sl = require('slugify');

const slugify = str => sl(str.toLocaleLowerCase());

const checkFileExists = filepath => new Promise((resolve) => {
  fs.access(filepath, fs.constants.R_OK, (err) => {
    if (err) {
      resolve(new Error(err.code === 'ENOENT' ? 'File does not exist' : 'File is not readable'));
      return;
    }

    resolve(null);
  });
});

const checkConfig = async () => {
  const existError = await checkFileExists(path.resolve('./sessionize.json'));

  return existError;
};

const getConfig = () => {
  const config = require(path.resolve('./sessionize.json')); // eslint-disable-line

  return config;
};

module.exports = {
  checkConfig,
  getConfig,
  slugify,
};
