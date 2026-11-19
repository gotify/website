import { defineConfig, openapi, type TabVersionsConfig } from "sourcey";
import anchors from "./anchors.json";
import releases from "./specs/releases.json";

// gotify.net/api-docs: the REST API of the newest gotify/server release, and every release before
// it in the version picker, from the specs fetch-specs.mjs downloads. Every deep link into the
// previous page (#/message/getMessages and the rest) lands on the operation it names.
const [latest, ...earlier] = releases;
const spec = (release: string) => openapi(`./specs/${release}.json`);
const versions: TabVersionsConfig = {
  default: latest,
  items: [
    { id: latest, label: latest, path: "" },
    ...earlier.map((release) => ({
      id: release,
      label: release,
      path: release,
      source: spec(release),
      notice: `The REST API of Gotify server ${release}.`,
      index: false,
    })),
  ],
};

export default defineConfig({
  name: "Gotify",
  siteUrl: "https://gotify.net",
  // Served beneath the VitePress site, which keeps its own home page, sitemap and 404.
  baseUrl: "/api-docs",
  // Beneath a path, each release is a folder of its own: /api-docs/v3.1.0/.
  prettyUrls: "slash",
  logo: { light: "../public/img/logo.png", mark: true },
  favicon: "../public/img/favicon.png",
  theme: { colors: { primary: "#3498db" } },
  navbar: {
    links: [
      { type: "link", href: "https://gotify.net/docs/", label: "Docs" },
      { type: "github", href: "https://github.com/gotify" },
    ],
  },
  navigation: {
    tabs: [{ id: "api", tab: "API Docs", slug: "", source: spec(latest), anchors, versions }],
  },
});
