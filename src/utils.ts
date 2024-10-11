/**
 * Sanitize the URL
 * @param url - The URL to sanitize
 * @returns The sanitized URL
 */
export function sanitize(url: string | undefined): string | undefined {
  if (typeof url === "undefined") {
    return;
  }
  return url.replace(/&/g, "&amp;");
}

/**
 * Check if the value is a string
 * @param value - The value to check
 * @returns True if the value is a string, false otherwise
 */
export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isNumber(value: any): value is number {
  return typeof value === "number";
}

/**
 * Check if the value is a valid URL
 * @param value - The value to check
 * @returns True if the value is a valid URL, false otherwise
 */
export function isURL(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if the tag name is a valid XML tag name
 * @param tagName - The tag name to check
 * @returns True if the tag name is valid, false otherwise
 */
export function isValidTagName(tagName: string): boolean {
  return /^[a-zA-Z_][\w.-]*$/.test(tagName);
}
