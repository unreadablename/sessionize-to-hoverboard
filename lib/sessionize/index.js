const { slugify } = require('../utils');

const api = require('./api');

const getSessions = async () => {
  const sessions = await api.getSessions();

  return sessions;

  // sessions
  //   .map(s => s.title)
  //   .forEach(t => console.log(t));
  // // console.log(json[0].sessions.length);
  // // console.log(json.sessions);
};

const getSpeakersFromSessions = async (sessions) => {
  // const sessions = await api.getSessions();

  const speakerIds = sessions
    .map(s => s.speakers)
    .reduce((acc, curr) => acc.concat(curr), [])
    .map(s => s.id)
    .reduce((acc, curr) => {
      if (acc.includes(curr)) {
        return acc;
      }

      return acc.concat([curr]);
    }, []);

  const speakers = await api.getSpeakers();
  // console.log(speakerIds.length);
  // console.log(speakers.length);

  return speakers
    .filter(s => speakerIds.includes(s.id));

  // return speakers.
};

module.exports = {
  getSessions,
  // getSpeakers,
  getSpeakersFromSessions,
};
