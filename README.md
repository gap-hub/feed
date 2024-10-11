<p align="center">
  <a href="https://github.com/facebook/jest"><img src="https://img.shields.io/badge/tested_with-jest-99424f.svg" alt="Tested with Jest"></a> <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>
<p align="center"><code>@gaphub/feed</code> - <strong>RSS 2.0, JSON Feed 1.0, Atom 1.0 and OPML 2.0</strong> generator/parser for <strong>Node.js</strong><br>
Making content syndication simple and intuitive!</p>

---

**👩🏻‍💻 Developer Ready**: Quickly generate syndication feeds for your Website.

**💪🏼 Strongly Typed**: Developed using TypeScript / type-safe.

**🔒 Tested**: Tests & snapshot for each syndication format to avoid regressions.

# ✨ New

## Features/Improvements

- Support parse JSON Feed/Atom Feed/RSS Feed to `Feed` object
- Style your feed with XSLT. You can use the `stylesheet` option to add a custom stylesheet to your feed.
- Support for JSON Feed 1.1
- Support for OPML 2.0
- Support custom fields for feed and feed items

# 🔨 Getting Started

## Installation

```bash
$ npm install @gaphub/feed

# or

$ yarn add @gaphub/feed

# or

$ pnpm install @gaphub/feed
```

## Example

### Generate Feed

```js
import { Feed } from "feed";

const feed = new Feed({
  title: "Feed Title",
  description: "This is my personal feed!",
  id: "http://example.com/",
  link: "http://example.com/",
  language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
  image: "http://example.com/image.png",
  favicon: "http://example.com/favicon.ico",
  copyright: "All rights reserved 2013, John Doe",
  updated: new Date(2013, 6, 14), // optional, default = today
  generator: "awesome", // optional, default = 'Feed for Node.js'
  feedLinks: {
    json: "https://example.com/json",
    atom: "https://example.com/atom",
  },
  author: {
    name: "John Doe",
    email: "johndoe@example.com",
    link: "https://example.com/johndoe",
  },
});

posts.forEach((post) => {
  feed.addItem({
    title: post.title,
    id: post.url,
    link: post.url,
    description: post.description,
    content: post.content,
    author: [
      {
        name: "Jane Doe",
        email: "janedoe@example.com",
        link: "https://example.com/janedoe",
      },
      {
        name: "Joe Smith",
        email: "joesmith@example.com",
        link: "https://example.com/joesmith",
      },
    ],
    contributor: [
      {
        name: "Shawn Kemp",
        email: "shawnkemp@example.com",
        link: "https://example.com/shawnkemp",
      },
      {
        name: "Reggie Miller",
        email: "reggiemiller@example.com",
        link: "https://example.com/reggiemiller",
      },
    ],
    date: post.date,
    image: post.image,
  });
});

feed.addCategory("Technologie");

feed.addContributor({
  name: "Johan Cruyff",
  email: "johancruyff@example.com",
  link: "https://example.com/johancruyff",
});

console.log(feed.rss2());
// Output: RSS 2.0

console.log(feed.atom1());
// Output: Atom 1.0

console.log(feed.json1());
// Output: JSON Feed 1.0
```

### Parse Feed

```js
import { FeedParser } from "@gaphub/feed";

const parser = new FeedParser();
// const feed = parser.parseString("<feed>...</feed>");
const feed = parser.parseURL("https://example.com/feed.rss");

console.log(feed);
```

### Generate and Parse OPML

```js
import { FeedParser, OPML } from "@gaphub/feed";

// Generate OPML
const opml = new Opml();
opml.setHead("title", "my test opml");
opml.setHead("dateCreated", new Date("Thu, 13 Oct 2005 15:34:07 GMT"));
opml.head.dateModified = new Date("Thu, 13 Oct 2005 15:34:07 GMT");
opml.head.ownerName = "Jon";
opml.addOutline({
  text: "United States",
  outlines: [
    {
      text: "Far West",
      outlines: [
        { text: "Alaska" },
        { text: "California" },
        { text: "Hawaii" },
      ],
    },
  ],
});
const xml = opml.toString();
console.log(xml);

// Parse OPML
const parser = new FeedParser();
// const parsedOPML = parser.parseOPMLFromURL("https://...");
const parsedOPML = parser.parseOPMLString(xml);
console.log(parsedOPML);
```

## More Information

- Follow [@Jon](https://x.com/laozhang_z) on 𝕏 for more information

## License

Copyright (C) 2024, Jon Zhang <jonzhang520s@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
