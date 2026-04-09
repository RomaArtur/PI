const ENTITY_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => ENTITY_MAP[character]);
