import { UI, URL } from './view.js';
import { modal } from './modal.js';
import { getCookie } from './cookie.js';
import { requestToServer } from './network.js';
import {render} from './loading.js'

modal();

requestToServer(URL.REQUEST_ME, 'GET').then(response => localStorage.setItem('userData', JSON.stringify(response)))

const socket = new WebSocket(`wss://chat1-341409.oa.r.appspot.com/websockets?${getCookie('token')}`);

socket.onmessage = function (event) {
  renderWebSocketMessage(JSON.parse(event.data));
};

async function renderWebSocketMessage(item) {
  render(item, JSON.parse(localStorage.getItem('userData')))

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
