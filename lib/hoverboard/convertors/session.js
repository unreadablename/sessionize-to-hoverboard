const getCategory = (session, categoryName) => {
  const categories = session.categories
    .filter(c => c.name === categoryName);

  if (categories.length < 1) {
    return [];
  }

  const [category] = categories;
  return category.categoryItems.map(c => c.name);
};

const convertSpeaker = (session, speakerIdMapping = {}) => ({
  id: session.id,
  title: session.title,
  description: session.description,
  complexity: getCategory(session, 'Level').join(', '),
  tags: getCategory(session, 'Track'),
  language: getCategory(session, 'Can you deliver a talk in English?').join('') === 'Yes' ? 'English' : '',
  speakers: session.speakers.map(s => speakerIdMapping[s.id] || s.id),
});

module.exports = convertSpeaker;
