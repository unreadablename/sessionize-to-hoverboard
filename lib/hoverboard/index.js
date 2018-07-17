const path = require('path');
const admin = require('firebase-admin');
const request = require('request');

const { getConfig } = require('../utils');
const {
  convertSession,
  convertSpeaker,
} = require('./convertors');

const getFirebaseApp = () => {
  try {
    return admin.app();
  } catch (e) {
    const config = getConfig();

    const serviceAccount = require(path.resolve(config.serviceAccount)); // eslint-disable-line

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: config.databaseURL,
      storageBucket: config.storageBucket,
    });

    admin.firestore();

    return admin.app();
  }
};

const getPublicUrl = filename => `https://storage.googleapis.com/${getConfig().storageBucket}/${filename}`;

const importPhotoPromise = (url, file) => new Promise((resolve, reject) => {
  request(url)
    .pipe(file.createWriteStream({
      contentType: 'auto',
      public: true,
    }))
    .on('error', reject)
    .on('finish', () => resolve());
});

const importPhoto = async (speaker) => {
  if (!speaker.profilePicture) {
    return {
      photo: '',
      photoUrl: '',
    };
  }
  const bucket = getFirebaseApp().storage().bucket();
  const fileExtension = speaker.profilePicture.slice(speaker.profilePicture.search(/\.[^.]+$/));
  const filename = `/images/speakers/${speaker.id}${fileExtension}`;
  const file = bucket.file(filename);

  await importPhotoPromise(speaker.profilePicture, file);

  return {
    photo: filename,
    photoUrl: getPublicUrl(filename.slice(1)),
  };
};

const importSpeakers = async (speakers) => {
  const firestore = getFirebaseApp().firestore();

  const batch = firestore.batch();

  const idMappings = {};

  await Promise.all(speakers
    .map(async (speaker, order) => {
      const converted = convertSpeaker(speaker);

      idMappings[speaker.id] = converted.id;

      const photo = await importPhoto({ ...speaker, id: converted.id });

      await batch.set(
        firestore.collection('speakers').doc(converted.id),
        { ...converted, ...photo, order },
      );
    }));

  await batch.commit();

  return idMappings;
};

const importSessions = async (sessions, speakerIdMapping) => {
  const firestore = getFirebaseApp().firestore();

  const batch = firestore.batch();

  const idMappings = {};

  sessions
    .forEach((session) => {
      const converted = convertSession(session, speakerIdMapping);
      // console.log(converted);
      // idMappings[speaker.id] = converted.id;

      // const photo = await importPhoto({ ...speaker, id: converted.id });

      batch.set(
        firestore.collection('sessions').doc(converted.id),
        converted,
      );
    });

  await batch.commit();

  return idMappings;
};

module.exports = {
  importSessions,
  importSpeakers,
};
