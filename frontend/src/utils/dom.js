export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

export function mount(parent, child) {
  if (Array.isArray(child)) {
    child.forEach((c) => parent.appendChild(c));
  } else {
    parent.appendChild(child);
  }
}

export function qs(selector, root = document) {
  const el = root.querySelector(selector);
  if (!el) throw new Error(`Elemento não encontrado: "${selector}"`);
  return el;
}

export function showEmptyState(container, mensagem) {
  clear(container);
  const div = document.createElement("div");
  div.className = "empty-state";
  div.innerHTML = `
    <span class="empty-state__icon">🏝️</span>
    <p>${mensagem}</p>
  `;
  container.appendChild(div);
}
