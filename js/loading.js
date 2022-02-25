import { requestToServer } from './network.js';
import { formatTime } from './formatTime.js';
import { UI, URL } from './view.js';

let start = -20;
let end = JSON.parse(localStorage.getItem('historyMessages')).length;
requestToServer(URL.REQUEST_MESSAGES, 'GET').then(response => {
  localStorage.setItem('historyMessages', JSON.stringify(response.messages));
  renderServerMessages();
});

function renderServerMessages(scroll) {
  if (end <= 0) {
    alert('Вся история загружена');
    return;
  }

  const messages = JSON.parse(localStorage.getItem('historyMessages'))
  .slice(start, end)
  .reverse();

  messages.forEach(item => {
    render(item, JSON.parse(localStorage.getItem('userData')), 'server');
  })

  if (scroll) {
    UI.CHAT.WINDOW.scrollTo(0, UI.CHAT.WINDOW.scrollHeight - scroll);
  } else {
    UI.CHAT.WINDOW.scrollTo(0, UI.CHAT.WINDOW.scrollHeight);
  }
}

UI.CHAT.WINDOW.addEventListener('scroll', function() {
  if (this.scrollTop == 0) {
    start += -20;
    end -= 20;
    renderServerMessages(UI.CHAT.WINDOW.scrollHeight)
  }
});

export function render(item, userData, server) {
  const template = UI.CHAT.TEMPLATE.content.cloneNode(true);

  if (userData.email == item.user.email) {
    template.querySelector('.nickname').innerHTML = 'Я';
    template.querySelector('.user-message').classList.add('my-message');
  } else {
    template.querySelector('.nickname').innerHTML = item.user.name;
  }

  template.querySelector('.message').innerHTML = item.text;
  template.querySelector('.time').innerHTML = formatTime(item.createdAt);

  if (server) {
    UI.CHAT.WINDOW.prepend(template);
  } else {
    UI.CHAT.WINDOW.append(template);
  }
}
