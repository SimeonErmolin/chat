import { UI, URL } from './view.js';
import { modal } from './modal.js';
import { getCookie } from './cookie.js';
import { requestToServer } from './network.js';
import { formatTime } from './formatTime.js';

modal();

requestToServer(URL.REQUEST_MESSAGES, 'GET').then(response => renderServerMessages(response.messages));

function renderServerMessages(messages) {
  messages.forEach(item => {
    const template = UI.CHAT.TEMPLATE.content.cloneNode(true);

    template.querySelector('.nickname').innerHTML = item.username;
    template.querySelector('.message').innerHTML = item.message;
    template.querySelector('.time').innerHTML = formatTime(item.createdAt);

    UI.CHAT.WINDOW.append(template);
  })
}

const socket = new WebSocket(`ws://chat1-341409.oa.r.appspot.com/websockets?${getCookie('token')}`);

socket.onmessage = function (event) {
  renderWebSocketMessage(JSON.parse(event.data));
};

async function renderWebSocketMessage(message) {
  const userData = await requestToServer(URL.REQUEST_ME, 'GET');

  const template = UI.CHAT.TEMPLATE.content.cloneNode(true);

  if (userData.email == message.user.email) {
    template.querySelector('.nickname').innerHTML = 'Я';
    template.querySelector('.user-message').classList.add('my-message');
  } else {
    template.querySelector('.nickname').innerHTML = message.user.name;
  }

  template.querySelector('.message').innerHTML = message.text;
  template.querySelector('.time').innerHTML = formatTime(message.createdAt);

  UI.CHAT.WINDOW.append(template);

  UI.CHAT.WINDOW.scrollTo(0, UI.CHAT.WINDOW.scrollHeight);
}

UI.CHAT.BTN_SEND_MESSAGE.addEventListener('click', addMessageHtml);

function addMessageHtml() {
  event.preventDefault();

  if (UI.CHAT.INPUT.value == "") return;

  socket.send(JSON.stringify({
    text: `${UI.CHAT.INPUT.value}`,
  }));

  UI.CHAT.FORM.reset();
}
