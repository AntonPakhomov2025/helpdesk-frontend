export function createTicketForm(name = '', description = '') {
  return `
    <div class="form-group">
      <label for="ticketName">Краткое описание</label>
      <input type="text" id="ticketName" value="${name.replace(/"/g, '&quot;')}" placeholder="Что нужно сделать">
    </div>
    <div class="form-group">
      <label for="ticketDescription">Подробное описание</label>
      <textarea id="ticketDescription" rows="4" placeholder="Детали...">${description}</textarea>
    </div>
  `;
}

export function createConfirmDialog(message) {
  return `<p>${message}</p>`;
}
