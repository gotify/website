// Downloads the REST API document of each gotify/server release the API docs offer, into
// api-docs/specs: the tags GitHub lists for gotify/server, newest first, each tag's
// docs/spec.json, and releases.json naming them in that order. The build runs it first.
import { mkdir, writeFile } from "node:fs/promises";

const specs = new URL("./specs/", import.meta.url);
const headers = { Accept: "application/vnd.github.v3+json" };
// In the workflow the token lifts GitHub's rate limit; a local build works without one.
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const res = await fetch("https://api.github.com/repos/gotify/server/tags", { headers });
if (!res.ok) throw new Error(`Could not list gotify/server tags: ${res.status}`);
const releases = (await res.json()).map((tag) => tag.name);

await mkdir(specs, { recursive: true });
await Promise.all(releases.map(async (release) => {
  const spec = await fetch(`https://raw.githubusercontent.com/gotify/server/${release}/docs/spec.json`);
  if (!spec.ok) throw new Error(`Could not fetch the spec of ${release}: ${spec.status}`);
  await writeFile(new URL(`${release}.json`, specs), await spec.text());
}));
await writeFile(new URL("releases.json", specs), JSON.stringify(releases, null, 2) + "\n");
console.log(`API docs: ${releases.length} releases, ${releases[0]} first`);
