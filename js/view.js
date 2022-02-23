export const UI = {
  CHAT: {
    FORM: document.querySelector(".form"),
    INPUT: document.querySelector(".text-message"),
    BTN_SEND_MESSAGE: document.querySelector(".send-message"),
    WINDOW: document.querySelector(".chat-window"),
    TEMPLATE: document.querySelector(".templateMessage"),
    PAGE: document.querySelector(".page"),
    BTN_OUT: document.querySelector(".out"),
    BTN_CLOSE: document.querySelectorAll(".close"),
  },
  SETTINGS: {
    BTN: document.querySelector(".settings"),
    POPAP: document.querySelector(".popap--name"),
    INPUT: document.querySelector(".name"),
    BTN_SEND_NAME: document.querySelector(".send-name"),
    FORM: document.querySelector(".form-settings"),
  },
  AUTHORIZATION: {
    POPAP: document.querySelector(".popap--authorization"),
    INPUT: document.querySelector(".authorization"),
    BTN: document.querySelector(".get-code"),
    FORM: document.querySelector(".form-auth"),
  },
  CONFIRMATION: {
    POPAP: document.querySelector(".popap--confirmation"),
    INPUT: document.querySelector(".confirmation"),
    BTN: document.querySelector(".to-enter"),
    FORM: document.querySelector(".form-conf"),
  },
}
export const URL = {
  REQUEST: 'https://chat1-341409.oa.r.appspot.com/api/user',
  REQUEST_ME: 'https://chat1-341409.oa.r.appspot.com/api/user/me',
  REQUEST_MESSAGES: 'https://chat1-341409.oa.r.appspot.com/api/messages/',
}
