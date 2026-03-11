export const fetchUrls = async () => {
  const res = await fetch('https://api.github.com/repos/gotify/server/tags', {
    headers: {Accept: 'application/vnd.github.v3+json'},
  });
  if (!res.ok) {
    throw Error('could not fetch tags');
  }
  const tags: {name: string}[] = await res.json();
  return tags.map((tag) => ({
    url: `https://raw.githubusercontent.com/gotify/server/${tag.name}/docs/spec.json`,
    name: tag.name,
  }));
};
