const api = require('./api');

const getSessions = async () => {
  const sessions = await api.getSessions();

  return sessions;
};

const getSpeakersFromSessions = async (sessions) => {
  const sessionsBySpeakerId = sessions.reduce((acc, curr) => {
    const add = {};
    curr.speakers.forEach((sp) => {
      if (!acc[sp.id]) {
        add[sp.id] = curr;
      }
    });

    return { ...acc, ...add };
  }, {});

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

  return speakers
    .filter(s => speakerIds.includes(s.id))
    .map(sp => ({
      ...sp,
      sessionData: sessionsBySpeakerId[sp.id],
    }));
};

module.exports = {
  getSessions,
  // getSpeakers,
  getSpeakersFromSessions,
};
