export const publisherImageMap: Record<
  string,
  string
> = {
  'Chennai Local Desk':
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=200&q=80',

  'Weather Desk':
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&q=80',

  'Local User':
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',

  'Sports Desk':
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200&q=80',

  'Politics Desk':
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&q=80',

  'Science Desk':
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&q=80',

  'Technology Desk':
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80',

  'Business Desk':
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80',

  'Cinema Desk':
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&q=80',

  'Health Desk':
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&q=80',
};

export function getPublisherImage(
  publisherName?: string,
) {
  const normalizedName =
    publisherName?.trim();

  if (!normalizedName) {
    return 'https://ui-avatars.com/api/?name=Publisher&background=F0442D&color=ffffff';
  }

  return (
    publisherImageMap[
      normalizedName
    ] ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      normalizedName,
    )}&background=F0442D&color=ffffff`
  );
}