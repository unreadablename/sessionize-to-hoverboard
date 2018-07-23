const { slugify } = require('../../utils');

const getAnswer = (session, question) => {
  const answers = session.questionAnswers
    .filter(c => c.question === question);

  if (answers.length < 1) {
    return null;
  }

  return answers[0].answer;
};

const convertSocial = (s) => {
  const linkType = s.linkType.toLocaleLowerCase();
  if ([
    'twitter',
    'linkedin',
    'facebook',
    'gplus',
    'github',
  ].includes(linkType)) {
    return {
      icon: linkType,
      name: s.title,
      link: s.url,
    };
  }

  return {
    icon: 'website',
    name: s.title,
    link: s.url,
  };
};

const convertSpeaker = speaker => ({
  id: slugify(speaker.fullName),
  bio: speaker.bio,
  name: speaker.fullName,
  featured: !!speaker.isTopSpeaker,
  title: speaker.tagLine,
  shortBio: speaker.bio,
  socials: speaker.links
    .map(convertSocial)
    .filter(s => s),
  country: getAnswer(speaker.sessionData, 'Where are you going to travel from?') || '',
});

module.exports = convertSpeaker;
