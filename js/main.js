import { UI, UI_SETTINGS, UI_AUTHORIZATION, UI_CONFIRMATION, URL } from './view.js';
import { modal } from './modal.js';
import { getCookie, setCookie } from './cookie.js';
import { requestToServer } from './network.js';
import { formatTime } from './formatTime.js';

const cookieToken = getCookie('token');
modal(cookieToken);

requestToServer(URL.URL_REQUEST_MESSAGES, 'GET').then(response => renderServerMessages(response.messages));

function renderServerMessages(messages) {
  messages.forEach(item => {
    const template = UI.TEMPLATE_MY_MESSAGE.content.cloneNode(true);

    template.querySelector('.nickname').innerHTML = item.username;
    template.querySelector('.message').innerHTML = item.message;
    template.querySelector('.time').innerHTML = formatTime(item.createdAt);

    UI.CHAT_WINDOW.append(template);
  })
}

const socket = new WebSocket(`ws://chat1-341409.oa.r.appspot.com/websockets?${cookieToken}`);

socket.onmessage = function (event) {
  renderWebSocketMessage(JSON.parse(event.data));
};

async function renderWebSocketMessage(message) {
  const userData = await requestToServer(URL.URL_REQUEST_ME, 'GET');

  const template = UI.TEMPLATE_MY_MESSAGE.content.cloneNode(true);

  if (userData.email == message.user.email) {
    template.querySelector('.nickname').innerHTML = 'Я';
    template.querySelector('.user-message').classList.add('my-message');
  } else {
    template.querySelector('.nickname').innerHTML = message.user.name;
  }

  template.querySelector('.message').innerHTML = message.text;
  template.querySelector('.time').innerHTML = formatTime(message.createdAt);

  UI.CHAT_WINDOW.append(template);

  UI.CHAT_WINDOW.scrollTo(0, UI.CHAT_WINDOW.scrollHeight);
}

UI.BTN_SEND_MESSAGE.addEventListener('click', addMessageHtml);

function addMessageHtml() {
  event.preventDefault();

  if (UI.INPUT_TEXT_MESSAGE.value == "") return;

  socket.send(JSON.stringify({
    text: `${UI.INPUT_TEXT_MESSAGE.value}`,
  }));

  UI.FORM_CHAT.reset();
}

UI_SETTINGS.BTN_SEND_NAME.addEventListener('click', sendName);

function sendName() {
  event.preventDefault();

  if (UI_SETTINGS.INPUT_NAME.value == "") return;

  requestToServer(URL.URL_REQUEST, 'PATCH', { name: `${UI_SETTINGS.INPUT_NAME.value}` });

  UI_SETTINGS.FORM_SETTINGS.reset();

  UI_SETTINGS.POPAP_SETTINGS.classList.remove('active');
  UI.PAGE.classList.remove('hidden');
  document.body.classList.remove('body-color')
}

UI_AUTHORIZATION.BTN_GET_CODE.addEventListener('click', getCode);

function getCode() {
  event.preventDefault();

  if (UI_AUTHORIZATION.INPUT_AUTHORIZATION.value == "") return;

  requestToServer(URL.URL_REQUEST, 'POST', { email: `${UI_AUTHORIZATION.INPUT_AUTHORIZATION.value}` });

  UI_AUTHORIZATION.FORM_AUTH.reset();

  UI_AUTHORIZATION.POPAP_AUTHORIZATION.classList.remove('active');
  UI_CONFIRMATION.POPAP_CONFIRMATION.classList.add('active');
}

UI_CONFIRMATION.BTN_TO_ENTER.addEventListener('click', saveToken);

function saveToken() {
  event.preventDefault();

  if (UI_CONFIRMATION.INPUT_CONFIRMATION.value == "") return;

  setCookie('token', UI_CONFIRMATION.INPUT_CONFIRMATION.value, 'max-age=86400e3');

  UI_CONFIRMATION.FORM_CONF.reset();

  UI_CONFIRMATION.POPAP_CONFIRMATION.classList.remove('active');
  UI.PAGE.classList.remove('hidden');
  document.body.classList.remove('body-color');
}
