import { UI, URL } from './view.js';
import { requestToServer } from './network.js';
import { deleteCookie, setCookie, getCookie } from './cookie.js';

export function modal() {
  if (!getCookie('token')) {
    UI.AUTHORIZATION.POPAP.classList.add('active');
    UI.CHAT.PAGE.classList.add('hidden');
    document.body.classList.add('body-color');
  }

  UI.SETTINGS.BTN.addEventListener('click', () => showPopap(UI.SETTINGS.POPAP));

  function showPopap(elem) {
    elem.classList.add('active');
    UI.CHAT.PAGE.classList.add('hidden');
    document.body.classList.add('body-color');
  }

  UI.CHAT.BTN_CLOSE.forEach(function (item) {
    item.addEventListener('click', closePopap);
  })

  function closePopap(elem) {
    if (!this) {
      elem.classList.remove('active');
    } else {
      this.parentElement.classList.remove('active');
    }
    UI.CHAT.PAGE.classList.remove('hidden');
    document.body.classList.remove('body-color');
  }

  UI.CHAT.BTN_OUT.addEventListener('click', callAuthorization);

  function callAuthorization() {
    deleteCookie('token');
    modal();
  }

  UI.SETTINGS.BTN_SEND_NAME.addEventListener('click', sendName);

  function sendName() {
    event.preventDefault();

    if (UI.SETTINGS.INPUT.value == "") return;

    requestToServer(URL.REQUEST, 'PATCH', { name: `${UI.SETTINGS.INPUT.value}` });

    UI.SETTINGS.FORM.reset();

    closePopap(UI.SETTINGS.POPAP);
  }

  UI.AUTHORIZATION.BTN.addEventListener('click', getCode);

  function getCode() {
    event.preventDefault();

    if (UI.AUTHORIZATION.INPUT.value == "") return;

    requestToServer(URL.REQUEST, 'POST', { email: `${UI.AUTHORIZATION.INPUT.value}` });

    UI.AUTHORIZATION.FORM.reset();

    closePopap(UI.AUTHORIZATION.POPAP);
    showPopap(UI.CONFIRMATION.POPAP)
  }

  UI.CONFIRMATION.BTN.addEventListener('click', saveToken);

  function saveToken() {
    event.preventDefault();

    if (UI.CONFIRMATION.INPUT.value == "") return;

    setCookie('token', UI.CONFIRMATION.INPUT.value, 'max-age=86400e3');

    UI.CONFIRMATION.FORM.reset();

    closePopap(UI.CONFIRMATION.POPAP);
  }
}
