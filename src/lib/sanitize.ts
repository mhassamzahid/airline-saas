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
