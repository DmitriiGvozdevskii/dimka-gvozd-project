import { makeAutoObservable } from 'mobx'

export default class UserStore {
  constructor() {
    this._isDark = true
    this._notifications = [
      { id: 1, type: "success", title: "Первое уведомление", content: "какой-то текст", lastSentAt: new Date() },
      { id: 2, type: "warning", title: "Второе уведомление", content: "какой-то текст", lastSentAt: new Date() },
      { id: 3, type: "fail", title: "Третье уведомление", content: "какой-то текст", lastSentAt: new Date() },
    ]

    this._ws = null

    makeAutoObservable(this)
  }

  setIsDark(bool) {
    this._isDark = bool
  }

  setNotifications(arr) {
    this._notifications = arr
  }

  setWs(obj) {
    this._ws = obj
  }



  get isDark() {
    return this._isDark
  }

  get notifications() {
    return this._notifications
  }

  get ws() {
    return this._ws
  }
}