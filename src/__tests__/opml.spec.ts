import { Opml } from "../opml";
import { FeedParser } from "../parser";

describe("OPML", () => {
  it("should parse OPML", async () => {
    const parser = new FeedParser();
    const opml = await parser.parseOPMLFromURL(
      "https://opml.org/examples/simpleScript.opml?format=opml",
    );
    expect(opml).toBeDefined();
  });

  it("render & parse OPML", () => {
    const opml = new Opml();
    opml.version = "2.0";
    opml.setHead("title", "my test opml");
    opml.setHead("dateCreated", new Date("Thu, 13 Oct 2005 15:34:07 GMT"));
    opml.head.dateModified = new Date("Thu, 13 Oct 2005 15:34:07 GMT");
    opml.head.ownerName = "Jon";
    opml.head.ownerEmail = "jon@example.com";
    opml.head.expansionState = [1, 5, 6];
    opml.head.windowTop = 100;
    opml.head.windowLeft = 100;
    opml.head.windowBottom = 200;
    opml.head.windowRight = 200;
    opml.addOutline({
      type: "rss",
      text: "CNET News.com",
      description:
        "Tech news and business reports by CNET News.com. Focused on information technology, core topics include computers, hardware, software, networking, and Internet media.",
      htmlUrl: "http://news.com.com/",
      language: "unknown",
      title: "CNET News.com",
      version: "RSS2",
      xmlUrl: "http://news.com.com/2547-1_3-0-5.xml",
    });
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
    opml.addOutline({
      type: "link",
      text: "Scripting News sites",
      created: new Date("Sun, 16 Oct 2005 05:56:10 GMT"),
      url: "http://hosting.opml.org/dave/mySites.opml",
    });
    const xml = opml.toString();
    expect(xml).toMatchSnapshot();

    const parsedOPML = new FeedParser().parseOPMLString(xml);
    expect(parsedOPML).toStrictEqual(opml);
  });
});
