import { createBrowserHistory, createHashHistory } from 'history'

//https://ayastreb.me/react-router-in-home-screen-pwa/

export default function configureHistory() {
  return window.matchMedia('(display-mode: standalone)').matches
    ? createHashHistory()
    : createBrowserHistory()
}