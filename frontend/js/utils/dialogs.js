const resolveDialog = (trigger) => {
  const selector = trigger.dataset.dialogClose;
  if (selector) {
    return document.querySelector(selector);
  }

  return trigger.closest("dialog");
};

export const bindDialogCloseButtons = (scope = document) => {
  scope.querySelectorAll("[data-dialog-close]").forEach((button) => {
    if (button.dataset.dialogBound === "true") return;

    button.dataset.dialogBound = "true";
    button.addEventListener("click", () => {
      resolveDialog(button)?.close();
    });
  });
};
