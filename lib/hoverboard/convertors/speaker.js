const { slugify } = require('../../utils');

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
});

module.exports = convertSpeaker;
