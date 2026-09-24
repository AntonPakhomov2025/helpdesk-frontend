import { TicketApi } from './TicketApi.js';
import { Modal, createTicketForm, createConfirmDialog } from './Modal.js';

export class HelpDeskApp {
  constructor() {
    this.api = new TicketApi();
    this.modal = new Modal();
    this.tickets = [];

    this.init();
  }

  async init() {
    await this.loadTickets();
    this.setupEventListeners();
  }

  async loadTickets() {
    try {
      this.tickets = await TicketApi.getAllTickets();
      this.renderTickets();
    } catch (e) {
      console.error('Failed to load tickets:', e);
    }
  }

  renderTickets() {
    const container = document.querySelector('.tickets-list');
    if (!container) return;
    container.innerHTML = '';

    this.tickets.forEach((ticket) => {
      const ticketEl = document.createElement('div');
      ticketEl.className = 'ticket';
      ticketEl.dataset.id = ticket.id;

      const statusClass = ticket.status ? 'ticket-status-done' : 'ticket-status-todo';
      const statusText = ticket.status ? '\u2713' : '';

      ticketEl.innerHTML = `
        <div class="ticket-status ${statusClass}" data-action="toggle">${statusText}</div>
        <div class="ticket-body" data-action="details">
          <div class="ticket-name">${this.escapeHtml(ticket.name)}</div>
          <div class="ticket-description" style="display:none;"></div>
        </div>
        <div class="ticket-date">${this.formatDate(ticket.created)}</div>
        <div class="ticket-actions">
          <button class="btn-edit" data-action="edit">\u270E</button>
          <button class="btn-delete" data-action="delete">\u2716</button>
        </div>
      `;
      container.appendChild(ticketEl);
    });
  }

  setupEventListeners() {
    const container = document.querySelector('.tickets-list');
    if (!container) return;

    container.addEventListener('click', async (e) => {
      const action = e.target.dataset.action;
      const ticketEl = e.target.closest('.ticket');
      if (!action || !ticketEl) return;

      const ticketId = ticketEl.dataset.id;
      const ticket = this.tickets.find((t) => String(t.id) === String(ticketId));
      if (!ticket) return;

      switch (action) {
        case 'toggle':
          await this.toggleStatus(ticket);
          break;
        case 'edit':
          this.openEditModal(ticket);
          break;
        case 'delete':
          this.openDeleteModal(ticket);
          break;
        case 'details':
          await this.toggleDetails(ticketEl, ticket);
          break;
      }
    });

    const addBtn = document.querySelector('.btn-add-ticket');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.openCreateModal());
    }
  }

  async toggleStatus(ticket) {
    try {
      // ОТПРАВЛЯЕМ ТОЛЬКО ИЗМЕНЯЕМОЕ ПОЛЕ — не трогаем description
      await TicketApi.updateTicket(ticket.id, {
        status: !ticket.status
      });
      await this.loadTickets();
    } catch (e) {
      console.error(e);
    }
  }

  async toggleDetails(ticketEl, ticket) {
    const descEl = ticketEl.querySelector('.ticket-description');
    if (descEl.style.display === 'none') {
      try {
        const fullTicket = await TicketApi.getTicketById(ticket.id);
        descEl.textContent = fullTicket.description || 'Описание отсутствует';
        descEl.style.display = 'block';
      } catch (e) {
        console.error(e);
      }
    } else {
      descEl.style.display = 'none';
    }
  }

  openCreateModal() {
  const html = `
    ${createTicketForm()}
    <div class="modal-buttons">
      <button class="btn-cancel">Отмена</button>
      <button class="btn-save">Сохранить</button>
    </div>
  `;

 
  this.modal.show(html, 'Новый тикет');

  const cancelBtn = this.modal.getCancelButton();
  const saveBtn = this.modal.getSaveButton();

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => this.modal.close());
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const nameInput = this.modal.getNameInput();
      const descInput = this.modal.getDescriptionInput();

      if (!nameInput || !nameInput.value.trim()) {
        alert('Название обязательно');
        return;
      }

      try {
        await TicketApi.createTicket({
          name: nameInput.value.trim(),
          description: descInput ? descInput.value.trim() : ''
        });
        await this.loadTickets();
        this.modal.close();
      } catch (e) {
        console.error('Ошибка создания тикета', e);
        alert('Не удалось сохранить тикет (проверь консоль)');
      }
    });
  }
}

  openEditModal(ticket) {
    const html = `
      ${createTicketForm(ticket.name, ticket.description)}
      <div class="modal-buttons">
        <button class="btn-cancel">Отмена</button>
        <button class="btn-save">Сохранить</button>
      </div>
    `;

    this.modal.show(html, null);

    this.modal.getCancelButton().addEventListener('click', () => this.modal.close());
    this.modal.getSaveButton().addEventListener('click', async () => {
      const name = this.modal.getNameInput().value.trim();
      const description = this.modal.getDescriptionInput().value.trim();
      if (!name) return;

      try {
        await TicketApi.updateTicket(ticket.id, { name, description });
        await this.loadTickets();
        this.modal.close();
      } catch (e) {
        console.error(e);
      }
    });
  }

  openDeleteModal(ticket) {
    const html = `
      ${createConfirmDialog('Удалить тикет? Это действие нельзя отменить.')}
      <div class="modal-buttons">
        <button class="btn-cancel">Отмена</button>
        <button class="btn-save">Удалить</button>
      </div>
    `;

    this.modal.show(html, null);

    this.modal.getCancelButton().addEventListener('click', () => this.modal.close());
    this.modal.getSaveButton().addEventListener('click', async () => {
      try {
        await TicketApi.deleteTicket(ticket.id);
        await this.loadTickets();
        this.modal.close();
      } catch (e) {
        console.error(e);
      }
    });
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  formatDate(timestamp) {
    const d = new Date(timestamp);
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
}
