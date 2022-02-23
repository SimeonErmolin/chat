import { UI, UI_SETTINGS, UI_AUTHORIZATION, UI_CONFIRMATION, URL } from './view.js';
import { requestToServer } from './network.js';
import { deleteCookie, setCookie, getCookie } from './cookie.js';

export function modal() {
  if (!getCookie('token')) {
    UI_AUTHORIZATION.POPAP_AUTHORIZATION.classList.add('active');
    UI.PAGE.classList.add('hidden');
    document.body.classList.add('body-color');
  }

  UI_SETTINGS.BTN_SETTINGS.addEventListener('click', () => showPopap(UI_SETTINGS.POPAP_SETTINGS));

  function showPopap(elem) {
    elem.classList.add('active');
    UI.PAGE.classList.add('hidden');
    document.body.classList.add('body-color');
  }

  UI.BTN_CLOSE.forEach(function (item) {
    item.addEventListener('click', closePopap);
  })

  function closePopap(elem) {
    if (!this) {
      elem.classList.remove('active');
    } else {
      this.parentElement.classList.remove('active');
    }
    UI.PAGE.classList.remove('hidden');
    document.body.classList.remove('body-color');
  }

  UI.BTN_OUT.addEventListener('click', callAuthorization);

  function callAuthorization() {
    deleteCookie('token');
    modal();
  }

  UI_SETTINGS.BTN_SEND_NAME.addEventListener('click', sendName);

  function sendName() {
    event.preventDefault();

    if (UI_SETTINGS.INPUT_NAME.value == "") return;

    requestToServer(URL.URL_REQUEST, 'PATCH', { name: `${UI_SETTINGS.INPUT_NAME.value}` });

    UI_SETTINGS.FORM_SETTINGS.reset();

    closePopap(UI_SETTINGS.POPAP_SETTINGS);
  }

  UI_AUTHORIZATION.BTN_GET_CODE.addEventListener('click', getCode);

  function getCode() {
    event.preventDefault();

    if (UI_AUTHORIZATION.INPUT_AUTHORIZATION.value == "") return;

    requestToServer(URL.URL_REQUEST, 'POST', { email: `${UI_AUTHORIZATION.INPUT_AUTHORIZATION.value}` });

    UI_AUTHORIZATION.FORM_AUTH.reset();

    closePopap(UI_AUTHORIZATION.POPAP_AUTHORIZATION);
    showPopap(UI_CONFIRMATION.POPAP_CONFIRMATION)
  }

  UI_CONFIRMATION.BTN_TO_ENTER.addEventListener('click', saveToken);

  function saveToken() {
    event.preventDefault();

    if (UI_CONFIRMATION.INPUT_CONFIRMATION.value == "") return;

    setCookie('token', UI_CONFIRMATION.INPUT_CONFIRMATION.value, 'max-age=86400e3');

    UI_CONFIRMATION.FORM_CONF.reset();

    closePopap(UI_CONFIRMATION.POPAP_CONFIRMATION);
  }
}
