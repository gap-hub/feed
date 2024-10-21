import { isValidTagName, sanitize } from "../utils";

describe("Sanitizing", () => {
  it("should sanitize & to &amp;", () => {
    expect("&amp;").toEqual(sanitize("&"));
  });
  it("should handle multiple &", () => {
    expect("https://test.com/?page=1&amp;size=3&amp;length=10").toEqual(
      sanitize("https://test.com/?page=1&size=3&length=10"),
    );
  });

  it("should handle undefined", () => {
    let undefined;
    expect(sanitize(undefined)).toBeUndefined();
  });
});

describe("isValidTagName", () => {
  it("should return true for valid tag names", () => {
    expect(isValidTagName("test")).toBe(true);
    expect(isValidTagName("dc:creator")).toBe(true);
    expect(isValidTagName("xml:title")).toBe(false);
    expect(isValidTagName("")).toBe(false);
  });
});
