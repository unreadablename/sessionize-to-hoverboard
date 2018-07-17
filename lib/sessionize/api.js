const rp = require('request-promise-native');
const { getConfig } = require('../utils');

const get = (section) => {
  const config = getConfig();
  const endpoint = config.sessionizeEndpoint;
  return rp(`${endpoint}${endpoint.slice(-1) === '/' ? '' : '/'}${section}`);
};

const getSessions = async () => {
  const response = await get('sessions');

  const json = JSON.parse(response);

  const sessionGroups = json;

  const { sessions } = sessionGroups[0];

  return sessions;
};

const getSpeakers = async () => {
  const response = await get('speakers');

  return JSON.parse(response);
};


module.exports = {
  getSessions,
  getSpeakers,
};
