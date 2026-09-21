# HelpDesk: Frontend

![Deploy](https://github.com/AntonPakhomov2025/helpdesk-frontend/actions/workflows/deploy.yml/badge.svg)

[Открыть на GitHub Pages](https://AntonPakhomov2025.github.io/helpdesk-frontend/)

## Описание

Фронтенд для сервиса управления тикетами (HelpDesk). Общается с бэкендом по HTTP через fetch API.

## Функционал

- Отображение списка тикетов (загрузка с сервера)
- Создание нового тикета (модальное окно)
- Редактирование тикета (модальное окно)
- Удаление тикета (модальное окно с подтверждением)
- Отметка о выполнении (клик по кружку слева)
- Просмотр подробного описания (клик по телу тикета, отдельный запрос к серверу)
- Иконка загрузки во время ожидания ответа

## Запуск

### Бэкенд

Склонируйте и запустите бэкенд:
```bash
git clone https://github.com/netology-fullstack/ahj-helpdesk-7_backend.git
cd ahj-helpdesk-7_backend
npm install
npm start
```
Сервер будет доступен по адресу `http://localhost:7070`.

### Фронтенд

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```
