import sanitizeHtml from "sanitize-html";

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

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, OPTIONS);
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
  return sanitizeHtml(html, MARKDOWN_OPTIONS);
}
