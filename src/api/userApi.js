import {SERVER_URL, checkStatus, parseJSON} from "./fetchUtils";



export function login(email, password) {
  // Ob E-Mail oder Passwort leer sind, kümmert uns hier nicht, das wird der Server schon merken
  return fetch(`${SERVER_URL}api/Angels/login?include=user`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data);
}


export function logout(token) {
  return fetch(`${SERVER_URL}api/Angels/logout?access_token=${token}`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: "{}"
  })
    .then(checkStatus);
}


export function update(token) {
  return fetch(`${SERVER_URL}api/Angels/me?access_token=${token}`, {
    method: "GET",
    mode: "cors",
    credentials: "include"
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data);
}


export function getRemainingTestAlarms(token) {
  return fetch(`${SERVER_URL}api/Angels/getremainingtestalarms?access_token=${token}`, {
    method: "GET",
    mode: "cors",
    credentials: "include"
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data.remaining);
}

export function changeReceiveTestAlarms(token, receiveTestAlarms) {
  let receiveTestAlarmsString = receiveTestAlarms ? "true" : "false";
  return fetch(`${SERVER_URL}api/Angels/changetestalarmsetting?access_token=${token}`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "receiveTestAlarms": receiveTestAlarmsString
    })
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data);
}
