// src/utils/auth.js
const AUTH_KEY = "sms_auth";

export function login(role) {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ isAuth: true, role })
  );
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function getAuth() {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : { isAuth: false, role: null };
}
