export class Modal {
  constructor() {
    // Контейнер модалки должен быть в HTML заранее, например:
    // <div id="app-modal" class="modal-container" style="display:none;"></div>
    this.container = document.getElementById('app-modal');
    if (!this.container) {
      console.error('Не найден #app-modal в HTML. Добавь его в index.html');
      return;
    }

    this.overlay = null;
    this.contentEl = null;
  }

  show(htmlContent, title) {
    // 1. Создаём оверлей (фон)
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    
    // 2. Создаём контент
    this.contentEl = document.createElement('div');
    this.contentEl.className = 'modal-content';
    if (title) {
      const header = document.createElement('h3');
      header.textContent = title;
      this.contentEl.appendChild(header);
    }
    this.contentEl.innerHTML = htmlContent;

    // Собираем всё вместе
    this.container.innerHTML = ''; // очищаем старый контент
    this.container.appendChild(this.overlay);
    this.container.appendChild(this.contentEl);
    this.container.style.display = 'flex';

    // 3. Вешаем закрытие по оверлею
    this.overlay.addEventListener('click', () => this.close());

    // 4. Вешаем закрытие по Esc
    this.escHandler = (e) => {
      if (e.key === 'Escape') this.close();
    };
    document.addEventListener('keydown', this.escHandler);

    // Фокус на первое поле, чтобы UX был лучше
    const firstInput = this.contentEl.querySelector('input, textarea');
    if (firstInput) firstInput.focus();
  }

  close() {
    if (this.container) this.container.style.display = 'none';
    if (this.escHandler) document.removeEventListener('keydown', this.escHandler);
    this.overlay = null;
    this.contentEl = null;
  }

  // Хелперы, чтобы твой openCreateModal мог найти кнопки
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
