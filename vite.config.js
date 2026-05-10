import * as fs from 'node:fs';
import * as marked from 'marked';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const advocateHtml = marked.parse(
  fs.readFileSync('passphrase_advocate.md', 'utf-8'),
  {
    async: false,
    breaks: false,
    gfm: true,
  },
);

export default defineConfig(() => ({
  define: {
    'import.meta.env.ADVOCATE_HTML': JSON.stringify(advocateHtml),
  },
  plugins: [viteSingleFile()],
}));
