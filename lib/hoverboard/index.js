const path = require('path');
const admin = require('firebase-admin');

const { getConfig } = require('../utils');
const { convertSpeaker } = require('./convertors');

const getFirebaseApp = () => {
  try {
    return admin.app();
  } catch (e) {
    const config = getConfig();

    const serviceAccount = require(path.resolve(config.serviceAccount)); // eslint-disable-line

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: config.databaseURL,
    });

    admin.firestore();

    return admin.app();
  }
};

const importSpeakers = async (speakers) => {
  const firestore = getFirebaseApp().firestore();

  const batch = firestore.batch();

  const idMappings = {};

  speakers
    .forEach((speaker, order) => {
      const converted = convertSpeaker(speaker);
      // console.log(converted);
      idMappings[speaker.id] = converted.id;

      batch.set(
        firestore.collection('speakers').doc(converted.id),
        { ...converted, order },
      );
    });

  await batch.commit();

  return idMappings;
};

module.exports = {
  importSpeakers,
};
