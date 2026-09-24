export class Modal {
  constructor() {
    this.container = document.getElementById('app-modal');
    if (!this.container) {
      console.error('Не найден #app-modal в HTML. Добавь его в index.html');
      return;
    }

    this.overlay = null;
    this.contentEl = null;
  }

  show(htmlContent, title) {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.contentEl = document.createElement('div');
    this.contentEl.className = 'modal-content';
    if (title) {
      const header = document.createElement('h3');
      header.textContent = title;
      this.contentEl.appendChild(header);
    }
    this.contentEl.innerHTML = htmlContent;
    this.container.innerHTML = ''; 
    this.container.appendChild(this.overlay);
    this.container.appendChild(this.contentEl);
    this.container.style.display = 'flex';
    this.overlay.addEventListener('click', () => this.close());
    this.escHandler = (e) => {
      if (e.key === 'Escape') this.close();
    };
    document.addEventListener('keydown', this.escHandler);
    const firstInput = this.contentEl.querySelector('input, textarea');
    if (firstInput) firstInput.focus();
  }

  close() {
    if (this.container) this.container.style.display = 'none';
    if (this.escHandler) document.removeEventListener('keydown', this.escHandler);
    this.overlay = null;
    this.contentEl = null;
  }
  getCancelButton() {
    return this.contentEl?.querySelector('.btn-cancel');
  }
  getSaveButton() {
    return this.contentEl?.querySelector('.btn-save');
  }
  getNameInput() {
    return this.contentEl?.querySelector('#ticketName');
  }
  getDescriptionInput() {
    return this.contentEl?.querySelector('#ticketDescription');
  }
}
