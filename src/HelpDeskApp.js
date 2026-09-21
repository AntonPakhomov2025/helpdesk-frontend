import TicketApi from './TicketApi';
import { createModal, createTicketForm, createConfirmDialog } from './Modal';

export default class HelpDeskApp {
  constructor() {
    this.ticketsList = document.getElementById('ticketsList');
    this.loading = document.getElementById('loading');
    this.addBtn = document.getElementById('addTicketBtn');
    this.expandedTicketId = null;
    this.addBtn.addEventListener('click', () => this.showAddModal());
    this.loadTickets();
  }

  async loadTickets() {
    this.loading.style.display = 'flex';
    this.ticketsList.innerHTML = '';
    try {
      const tickets = await TicketApi.getAllTickets();
      this.renderTickets(tickets);
    } catch (e) {
      console.error(e);
      this.ticketsList.innerHTML = '<li style="padding:16px;color:#999;text-align:center;">Не удалось загрузить тикеты. Проверьте, что сервер запущен.</li>';
    } finally {
      this.loading.style.display = 'none';
    }
  }

  renderTickets(tickets) {
    this.ticketsList.innerHTML = '';
    tickets.forEach((ticket) => {
      const li = document.createElement('li');
      li.className = 'ticket';
      li.dataset.id = ticket.id;

      const status = document.createElement('div');
      status.className = 'ticket-status' + (ticket.status ? ' done' : '');
      status.addEventListener('click', (e) => { e.stopPropagation(); this.toggleStatus(ticket); });

      const name = document.createElement('div');
      name.className = 'ticket-name' + (ticket.status ? ' done' : '');
      name.textContent = ticket.name;

      const date = document.createElement('div');
      date.className = 'ticket-date';
      date.textContent = this.formatDate(ticket.created);

      const actions = document.createElement('div');
      actions.className = 'ticket-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'ticket-btn edit';
      editBtn.textContent = '\u270E';
      editBtn.title = 'Редактировать';
      editBtn.addEventListener('click', (e) => { e.stopPropagation(); this.showEditModal(ticket); });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'ticket-btn delete';
      deleteBtn.textContent = '\u00D7';
      deleteBtn.title = 'Удалить';
      deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); this.showDeleteModal(ticket); });

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      li.appendChild(status);
      li.appendChild(name);
      li.appendChild(date);
      li.appendChild(actions);
      li.addEventListener('click', () => this.toggleDetails(ticket, li));
      this.ticketsList.appendChild(li);

      const details = document.createElement('div');
      details.className = 'ticket-details';
      details.dataset.id = ticket.id;
      this.ticketsList.appendChild(details);
    });
  }

  async toggleDetails(ticket, li) {
    const detailsEl = this.ticketsList.querySelector(`.ticket-details[data-id="${ticket.id}"]`);
    if (this.expandedTicketId === ticket.id) {
      detailsEl.classList.remove('open');
      this.expandedTicketId = null;
      return;
    }
    if (this.expandedTicketId) {
      const prev = this.ticketsList.querySelector(`.ticket-details[data-id="${this.expandedTicketId}"]`);
      if (prev) prev.classList.remove('open');
    }
    detailsEl.textContent = 'Загрузка...';
    detailsEl.classList.add('open');
    this.expandedTicketId = ticket.id;
    try {
      const full = await TicketApi.getTicketById(ticket.id);
      detailsEl.textContent = full.description || 'Описание отсутствует';
    } catch (e) {
      detailsEl.textContent = 'Не удалось загрузить описание';
    }
  }

  async toggleStatus(ticket) {
    try {
      await TicketApi.updateTicket(ticket.id, {
        id: ticket.id, name: ticket.name, description: '',
        status: !ticket.status, created: ticket.created,
      });
      this.loadTickets();
    } catch (e) { console.error(e); }
  }

  showAddModal() {
    const formHtml = createTicketForm();
    const modal = createModal('Добавить тикет', formHtml, [
      { text: 'Отмена', className: 'btn-cancel', onClick: () => modal.close() },
      {
        text: 'Сохранить', className: 'btn-save',
        onClick: async () => {
          const name = document.getElementById('ticketName').value.trim();
          const description = document.getElementById('ticketDescription').value.trim();
          if (!name) { alert('Введите краткое описание'); return; }
          try {
            await TicketApi.createTicket({ id: null, name, description, status: false, created: Date.now() });
            modal.close();
            this.loadTickets();
          } catch (e) { alert('Не удалось создать тикет. Проверьте, что сервер запущен.'); }
        }
      }
    ]);
  }

  async showEditModal(ticket) {
    let description = '';
    try {
      const full = await TicketApi.getTicketById(ticket.id);
      description = full.description || '';
    } catch (e) { console.error(e); }
    const formHtml = createTicketForm(ticket.name, description);
    const modal = createModal('Редактировать тикет', formHtml, [
      { text: 'Отмена', className: 'btn-cancel', onClick: () => modal.close() },
      {
        text: 'Сохранить', className: 'btn-save',
        onClick: async () => {
          const name = document.getElementById('ticketName').value.trim();
          const desc = document.getElementById('ticketDescription').value.trim();
          if (!name) { alert('Введите краткое описание'); return; }
          try {
            await TicketApi.updateTicket(ticket.id, { id: ticket.id, name, description: desc, status: ticket.status, created: ticket.created });
            modal.close();
            this.loadTickets();
          } catch (e) { alert('Не удалось обновить тикет.'); }
        }
      }
    ]);
  }

  showDeleteModal(ticket) {
    const html = createConfirmDialog(`Удалить тикет "${ticket.name}"?`);
    const modal = createModal('Удалить тикет', html, [
      { text: 'Отмена', className: 'btn-cancel', onClick: () => modal.close() },
      {
        text: 'Удалить', className: 'btn-delete-confirm',
        onClick: async () => {
          try {
            await TicketApi.deleteTicket(ticket.id);
            modal.close();
            this.loadTickets();
          } catch (e) { alert('Не удалось удалить тикет.'); }
        }
      }
    ]);
  }

  formatDate(timestamp) {
    const d = new Date(timestamp);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${mins}`;
  }
}
