
export function addError(viewerEl, errorMessage) {
  viewerEl.classList.remove("hidden");
  const error = `<li class="py-1">${errorMessage}</li>`;
  viewerEl.innerHTML += error;
}
