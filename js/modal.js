import { UI, UI_SETTINGS, UI_AUTHORIZATION } from './view.js';
import { deleteCookie } from './cookie.js';

export function modal(cookieToken) {
  if (!cookieToken) {
    UI_AUTHORIZATION.POPAP_AUTHORIZATION.classList.add('active');
    UI.PAGE.classList.add('hidden');
    document.body.classList.add('body-color');
  }

  UI_SETTINGS.BTN_SETTINGS.addEventListener('click', showPopapSettings)
  function showPopapSettings() {
    UI_SETTINGS.POPAP_SETTINGS.classList.add('active');
    UI.PAGE.classList.add('hidden');
    document.body.classList.add('body-color');
  }
  UI.BTN_CLOSE.forEach(function (item) {
    item.addEventListener('click', closeModal);
  })
  function closeModal() {
    this.parentElement.classList.remove('active');
    UI.PAGE.classList.remove('hidden');
    document.body.classList.remove('body-color')
  }
}

UI.BTN_OUT.addEventListener('click', callAuthorization);

function callAuthorization() {
  deleteCookie('token');
  modal();
}
