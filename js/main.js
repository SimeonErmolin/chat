import { UI, UI_SETTINGS, UI_AUTHORIZATION, UI_CONFIRMATION, URL } from './view.js';
import { modal } from './modal.js';
import { deleteCookie, getCookie, setCookie } from './cookie.js';
import { requestToServer } from './network.js';
import { formatTime } from './formatTime.js';

const cookieToken = getCookie('token');
modal(cookieToken);

const socket = new WebSocket(`wss://chat1-341409.oa.r.appspot.com/websockets?${cookieToken}`);
socket.onopen = function (e) {
  socket.send(JSON.stringify({
    text: 'тестовый тест',
  }));
};
socket.onmessage = function (event) {
  renderWebSocketMessage(JSON.parse(event.data));
};

async function renderWebSocketMessage(message) {
  const userList = await getDateUser();

  if (userList.email == message.user.email) {
    UI.TEMPLATE_MY_MESSAGE.content.querySelector('.nickname').innerHTML = 'Я';
  } else {
    UI.TEMPLATE_MY_MESSAGE.content.querySelector('.nickname').innerHTML = message.user.name;
  }

  UI.TEMPLATE_MY_MESSAGE.content.querySelector('.message').innerHTML = message.text;
  UI.TEMPLATE_MY_MESSAGE.content.querySelector('.time').innerHTML = formatTime(message.createdAt);

  UI.CHAT_WINDOW.append(UI.TEMPLATE_MY_MESSAGE.content.cloneNode(true));
}


async function getDateUser() {
  try {
    const response = await requestToServer(URL.URL_REQUEST_ME, 'GET');
    UI.TEMPLATE_MY_MESSAGE.content.querySelector('.nickname').innerHTML = response.name;
    return response;
  } catch (err) {
    alert(err);
  }
}

async function getMessagesFromServer() {
  try {
    const response = await requestToServer(URL.URL_REQUEST_MESSAGES, 'GET');
    renderServerMessages(response.messages);
  } catch (err) {
    alert(err);
  }
}
getMessagesFromServer();

function renderServerMessages(messages) {
  UI.CHAT_WINDOW.innerHTML = '';

  messages.forEach(item => {
    UI.TEMPLATE_MY_MESSAGE.content.querySelector('.nickname').innerHTML = item.username;
    UI.TEMPLATE_MY_MESSAGE.content.querySelector('.message').innerHTML = item.message;
    UI.TEMPLATE_MY_MESSAGE.content.querySelector('.time').innerHTML = formatTime(item.createdAt);

    UI.CHAT_WINDOW.append(UI.TEMPLATE_MY_MESSAGE.content.cloneNode(true));
  })
}

UI.BTN_SEND_MESSAGE.addEventListener('click', addMessageHtml);

async function addMessageHtml() {
  event.preventDefault();

  if (UI.INPUT_TEXT_MESSAGE.value == "") return;

  await getDateUser();

    socket.send(JSON.stringify({
      text: `${UI.INPUT_TEXT_MESSAGE.value}`,
    }));

  UI.FORM_CHAT.reset();

  UI.CHAT_WINDOW.scrollTo(0, UI.CHAT_WINDOW.scrollHeight);
}

UI_SETTINGS.BTN_SEND_NAME.addEventListener('click', sendName);

async function sendName() {
  event.preventDefault();

  if (UI_SETTINGS.INPUT_NAME.value == "") return;

  await requestToServer(URL.URL_REQUEST, 'PATCH', { name: `${UI_SETTINGS.INPUT_NAME.value}` });

  await getDateUser();

  UI_SETTINGS.FORM_SETTINGS.reset();
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

UI.BTN_OUT.addEventListener('click', callAuthorization);

function callAuthorization() {
  deleteCookie('token');
  modal();
}
