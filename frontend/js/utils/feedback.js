const FEEDBACK_MODIFIERS = ["is-visible", "is-success", "is-error"];

const clearModifierClasses = (element) => {
  element.classList.remove(...FEEDBACK_MODIFIERS);
};

export const clearFeedbackState = (element) => {
  if (!element) return;

  clearModifierClasses(element);
  element.textContent = "";
};

export const setFeedbackState = (element, message, tone = "") => {
  if (!element) return;

  clearModifierClasses(element);
  element.textContent = message;

  if (!message) return;

  element.classList.add("is-visible");

  if (tone === "success" || tone === "error") {
    element.classList.add(`is-${tone}`);
  }
};
