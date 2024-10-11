import { defaultTextType } from "./config";
import { Author, Category, Extension, ItemOptions, Text } from "./typings";
import { isString } from "./utils";

export class FeedItem {
  readonly options: ItemOptions;
  readonly customFields: Record<string, string | string[]> = {};

  constructor(options: ItemOptions) {
    this.options = options;
  }

  setId(id: string) {
    this.options.id = id;
  }

  setTitle(title: Text | string) {
    if (isString(title)) {
      this.options.title = { text: title, type: defaultTextType };
    } else {
      this.options.title = title;
    }
  }

  setDescription(description: Text | string) {
    if (isString(description)) {
      this.options.description = { text: description, type: defaultTextType };
    } else {
      this.options.description = description;
    }
  }

  setContent(content: Text | string) {
    if (isString(content)) {
      this.options.content = { text: content, type: defaultTextType };
    } else {
      this.options.content = content;
    }
  }

  setLink(link: string) {
    this.options.link = link;
  }

  setDate(date: Date) {
    this.options.date = date;
  }

  addCategory(category: string | Category) {
    if (!this.options.category) {
      this.options.category = [];
    }
    if (isString(category)) {
      this.options.category.push({ name: category });
    } else {
      this.options.category.push(category);
    }
  }

  addAuthor(author: string | Author) {
    if (!this.options.authors) {
      this.options.authors = [];
    }
    if (isString(author)) {
      this.options.authors.push({ name: author });
    } else {
      this.options.authors.push(author);
    }
  }

  addContributor(contributor: string | Author) {
    if (!this.options.contributors) {
      this.options.contributors = [];
    }
    if (isString(contributor)) {
      this.options.contributors.push({ name: contributor });
    } else {
      this.options.contributors.push(contributor);
    }
  }

  setPublished(date: Date) {
    this.options.published = date;
  }

  setCopyright(copyright: string) {
    this.options.copyright = copyright;
  }

  addExtension(extension: Extension) {
    if (!this.options.extensions) {
      this.options.extensions = [];
    }
    this.options.extensions.push(extension);
  }

  setExtensions(extensions: Extension[]) {
    this.options.extensions = extensions;
  }

  setCustomField(field: string, value: string | string[]) {
    this.customFields[field] = value;
  }

  setCustomFields(fields: Record<string, string | string[]>) {
    Object.keys(fields).forEach((key) => {
      this.customFields[key] = fields[key];
    });
  }

  getCustomField(field: string): string | string[] | undefined {
    return this.customFields[field];
  }
}
