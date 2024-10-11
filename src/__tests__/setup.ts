import { Feed } from "../feed";
import { FeedItem } from "../feed-item";

export const updated = new Date("Sat, 13 Jul 2013 23:00:00 GMT");
export const published = new Date("Sat, 10 Jul 2013 23:00:00 GMT");

export const sampleFeed = new Feed({
  title: "Feed Title",
  description: "This is my personnal feed!",
  link: "http://example.com/",
  id: "http://example.com/",
  feed: "http://example.com/sampleFeed.rss",
  feedLinks: {
    json: "http://example.com/sampleFeed.json",
  },
  language: "en",
  ttl: 60,
  image: "http://example.com/image.png",
  favicon: "http://example.com/image.ico",
  copyright: "All rights reserved 2013, John Doe",
  hub: "wss://example.com/",
  updated, // optional, default = today

  authors: [
    {
      name: "John Doe",
      email: "johndoe@example.com",
      link: "https://example.com/johndoe?link=sanitized&value=2",
    },
  ],
});
sampleFeed.stylesheet = "https://example.com/stylesheet.xsl";
sampleFeed.addCategory("Technology");
sampleFeed.setCustomField("customField", "customValue");
sampleFeed.setCustomField("customFieldArray", ["customValue1", "customValue2"]);

sampleFeed.addContributor("Jon Zhang");
sampleFeed.addContributor({
  name: "Johan Cruyff",
  email: "johancruyff@example.com",
  link: "https://example.com/johancruyff",
});

const item = new FeedItem({
  title: { text: "Hello World", type: "text" },
  link: "https://example.com/hello-world?link=sanitized&value=2",
  date: updated,
});
item.setId("https://example.com/hello-world?id=this&that=true");
item.setDescription({
  text: "This is an article about Hello World.",
  type: "text",
});
item.setContent({
  text: "Content of my item",
  type: "text",
});
item.addAuthor({
  name: "Jane Doe",
  email: "janedoe@example.com",
  link: "https://example.com/janedoe?link=sanitized&value=2",
});
item.addAuthor({
  name: "Joe Smith",
  email: "joesmith@example.com",
  link: "https://example.com/joesmith",
});
item.addAuthor("Joe Smith, Name Only");
item.addContributor({
  name: "Shawn Kemp",
  email: "shawnkemp@example.com",
  link: "https://example.com/shawnkemp",
});
item.addContributor({
  name: "Reggie Miller",
  email: "reggiemiller@example.com",
  link: "https://example.com/reggiemiller",
});
item.addExtension({
  name: "_item_extension_1",
  objects: {
    about: "just an item extension example",
    dummy1: "example",
  },
});
item.addExtension({
  name: "_item_extension_2",
  objects: {
    about: "just a second item extension example",
    dummy1: "example",
  },
});
item.addCategory("Grateful Dead");
item.addCategory({ name: "MSFT", domain: "http://www.fool.com/cusips" });
item.options.image = "https://example.com/hello-world.jpg";
item.options.enclosure = {
  url: "https://example.com/hello-world.jpg",
  length: 12665,
  type: "image/jpeg",
};
item.setPublished(published);
item.setCopyright("All rights reserved 2024, Jon Zhang");
item.setCustomField("customFieldItem", "customValueItem");
item.setCustomField("customFieldItemArray", [
  "customValueItem1",
  "customValueItem2",
]);

sampleFeed.addItem(item);

sampleFeed.addExtension({
  name: "_example_extension",
  objects: {
    about: "just an extension example",
    dummy: "example",
  },
});
