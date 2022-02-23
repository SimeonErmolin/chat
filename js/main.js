import { UI, URL } from './view.js';
import { modal } from './modal.js';
import { getCookie } from './cookie.js';
import { requestToServer } from './network.js';
import { formatTime } from './formatTime.js';

modal();

requestToServer(URL.REQUEST_MESSAGES, 'GET').then(response => renderServerMessages(response.messages));

async function renderServerMessages(messages) {
  const userData = await requestToServer(URL.REQUEST_ME, 'GET');

  messages.forEach(item => render(item, userData))

  UI.CHAT.WINDOW.scrollTo(0, UI.CHAT.WINDOW.scrollHeight);
}

const socket = new WebSocket(`wss://chat1-341409.oa.r.appspot.com/websockets?${getCookie('token')}`);

socket.onmessage = function (event) {
  renderWebSocketMessage(JSON.parse(event.data));
};

async function renderWebSocketMessage(item) {
  const userData = await requestToServer(URL.REQUEST_ME, 'GET');

  render(item, userData)

  UI.CHAT.WINDOW.scrollTo(0, UI.CHAT.WINDOW.scrollHeight);
}

function render(item, userData) {
  const template = UI.CHAT.TEMPLATE.content.cloneNode(true);

  if (userData.email == item.user.email) {
    template.querySelector('.nickname').innerHTML = 'Я';
    template.querySelector('.user-message').classList.add('my-message');
  } else {
    template.querySelector('.nickname').innerHTML = item.user.name;
  }

  template.querySelector('.message').innerHTML = item.text;
  template.querySelector('.time').innerHTML = formatTime(item.createdAt);

  UI.CHAT.WINDOW.append(template);
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
