import fs from "fs";
import marked from "marked";
import * as hljs from "highlight.js";

// Create reference instance
// const marked = require("marked");
// Set options
// `highlight` example uses https://highlightjs.org
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight(code: string, lang: string) {
    // eslint-disable-next-line global-require
    // const hljs = require("highlight.js");
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

const docPath = "docs/readme/index.html";
const stylePath = "src/scripts/readme/github.style";
const markdownString = fs.readFileSync("README.md", { encoding: "utf8", flag: "r" });

fs.mkdirSync("docs/readme", { recursive: true });
fs.writeFileSync(docPath, marked(markdownString));
// append css
const data = fs.readFileSync(docPath); // read existing contents into data
const fd = fs.openSync(docPath, "w+");
const buffer = Buffer.from(fs.readFileSync(stylePath, { encoding: "utf8", flag: "r" }));

fs.writeSync(fd, buffer, 0, buffer.length, 0); // write new data
fs.writeSync(fd, data, 0, data.length, buffer.length); // append old data
// or fs.appendFile(fd, data);
// eslint-disable-next-line @typescript-eslint/no-empty-function
fs.close(fd, () => {});
