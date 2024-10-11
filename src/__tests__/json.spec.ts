import { FeedParser } from "../parser";
import { sampleFeed } from "./setup";

describe("json 1", () => {
  it("should generate a valid feed and parse back to feed", async () => {
    const actual = sampleFeed.json1();
    expect(actual).toMatchSnapshot("generated");

    const parser = new FeedParser();
    const parsedFeed = await parser.parseString(actual);
    expect(parsedFeed).not.toBeNull();
    expect(parsedFeed!.json1()).toMatchSnapshot("parsed");
  });
});
