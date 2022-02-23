import { getCookie } from './cookie.js';

export async function requestToServer(url, method, body) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${getCookie('token')}`
      },
      body: JSON.stringify(body)
    })
    const result = await response.json();
    return result;
  } catch (err) {
    alert(err)
  }
}
