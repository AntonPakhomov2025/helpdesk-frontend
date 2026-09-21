export function createModal(title, contentHtml, actions) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  const modal = document.createElement('div');
  modal.className = 'modal';
  const h2 = document.createElement('h2');
  h2.textContent = title;
  modal.appendChild(h2);
  const content = document.createElement('div');
  content.innerHTML = contentHtml;
  modal.appendChild(content);
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'modal-actions';
  actions.forEach(({ text, className, onClick }) => {
    const btn = document.createElement('button');
    btn.className = `btn ${className}`;
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    actionsDiv.appendChild(btn);
  });
  modal.appendChild(actionsDiv);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  return { close() { overlay.remove(); }, overlay };
}

export function createTicketForm(name = '', description = '') {
  return `<div class="form-group"><label for="ticketName">Краткое описание</label><input type="text" id="ticketName" value="${name.replace(/"/g, '&quot;')}" placeholder="Что нужно сделать"></div><div class="form-group"><label for="ticketDescription">Подробное описание</label><textarea id="ticketDescription" rows="4" placeholder="Детали...">${description}</textarea></div>`;
}

export function createConfirmDialog(message) {
  return `<p>${message}</p>`;
}
