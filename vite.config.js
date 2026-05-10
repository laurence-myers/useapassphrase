import { viteSingleFile } from "vite-plugin-singlefile";
import * as marked from "marked";
import * as fs from "node:fs";
import { defineConfig } from 'vite';

const advocateHtml = marked.parse(fs.readFileSync('passphrase_advocate.md', 'utf-8'), {
    async: false,
    breaks: false,
    gfm: true,
})

export default defineConfig(() => ({
    define: {
        'import.meta.env.ADVOCATE_HTML': JSON.stringify(advocateHtml),
    },
    plugins: [
        viteSingleFile()
    ],
}));
