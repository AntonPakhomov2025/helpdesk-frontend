import './index.css';
import { HelpDeskApp } from './HelpDeskApp';
document.addEventListener('DOMContentLoaded', () => { new HelpDeskApp(); });

document.addEventListener('DOMContentLoaded', () => {
  const app = new HelpDeskApp();
  const btn = document.querySelector('button');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('>>> Клик сработал, вызываем openCreateModal');
      app.openCreateModal();
    });
  } else {
    console.warn('Кнопка не найдена в DOM');
  }
});
