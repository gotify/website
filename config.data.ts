import {createMarkdownRenderer} from 'vitepress';

const SOURCE = 'https://raw.githubusercontent.com/gotify/server/master/gotify-server.env.example';

const uncomment = (line: string): string => line.replace(/^#( ?)/, '');
const codeBlock = (text: string) => '```\n' + text.trimEnd() + '\n```';

const renderSetting = (block: string[]): string => {
  const assignment = block.find((l) => /^[A-Z][A-Z0-9_]*=/.test(uncomment(l)));
  if (!assignment) throw Error('could not find assignment ' + block);

  const name = uncomment(assignment).split('=')[0];
  return ['### ' + name, codeBlock(block.join('\n'))].join('\n\n');
};

export default {
  async load() {
    const res = await fetch(SOURCE);
    if (!res.ok) throw Error('could not fetch gotify-server.env.example');

    const [header, ...blocks] = (await res.text())
      .trimEnd()
      .split(/\n *\n/)
      .map((b) => b.split('\n'))
      .filter((b) => b.some((l) => l.trim()));

    const markdown = [
      codeBlock(header.map(uncomment).join('\n')),
      ...blocks.map(renderSetting),
    ].join('\n\n');

    return (await createMarkdownRenderer('.')).render(markdown);
  },
};
