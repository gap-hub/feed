import { FeedParser } from "../parser";
import { sampleFeed } from "./setup";

describe("atom 1.0", () => {
  it("should generate a valid feed", async () => {
    const actual = sampleFeed.atom1();
    expect(actual).toMatchSnapshot();

    const parser = new FeedParser();
    const parsedFeed = await parser.parseString(actual);
    expect(parsedFeed).not.toBeNull();
    expect(parsedFeed!.atom1()).toMatchSnapshot();
  });
});
