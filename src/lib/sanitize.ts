import sanitizeHtml from "sanitize-html";
import { slugify } from "./utils";

// Wagtail already whitelists rich-text features server-side; this is a
// second pass, constrained to exactly the tags the RichTextBlock allows.
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["h2", "h3", "p", "a", "ol", "ul", "li", "hr", "blockquote", "b", "strong", "i", "em", "br"],
  allowedAttributes: { a: ["href", "rel", "target"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
};

// Gives every h2/h3/h4 an id derived from its text, so the Section links
// block can point `#anchor` hrefs at headings elsewhere on the page.
function addHeadingIds(html: string): string {
  return html.replace(/<(h[234])>(.*?)<\/\1>/gs, (_match, tag: string, inner: string) => {
    const id = slugify(inner.replace(/<[^>]+>/g, ""));
    return `<${tag} id="${id}">${inner}</${tag}>`;
  });
}

export function sanitizeRichText(html: string): string {
  return addHeadingIds(sanitizeHtml(html, OPTIONS));
}

// Broader set for the Markdown block (policy / terms pages): headings h1-h4,
// tables, and inline code, on top of the rich-text tags.
const MARKDOWN_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "p", "a", "ul", "ol", "li", "hr", "blockquote",
    "b", "strong", "i", "em", "br", "code", "pre",
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  allowedAttributes: {
    a: ["href", "rel", "target"],
    th: ["align"],
    td: ["align"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
};

export function sanitizeMarkdown(html: string): string {
  return addHeadingIds(sanitizeHtml(html, MARKDOWN_OPTIONS));
}
