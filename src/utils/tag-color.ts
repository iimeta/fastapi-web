const TAG_COLORS = [
  'red',
  'orangered',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'arcoblue',
  'purple',
  'pinkpurple',
  'magenta',
];

export const getTagColor = (tag: string): string => {
  let hash = 5381;
  for (let i = 0; i < tag.length; i += 1) {
    hash = (hash * 33 + tag.charCodeAt(i)) % 2147483647;
  }
  return TAG_COLORS[hash % TAG_COLORS.length];
};
