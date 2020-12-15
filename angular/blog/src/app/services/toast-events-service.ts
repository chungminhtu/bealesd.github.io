import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastEvents {
  toasts = []

  constructor() { }

  add(toastObject) {
    const toast = this.toasts.find(m => m.message === toastObject.message);
    const isNewToast = toast === undefined;
    if (isNewToast)
      this.toasts.push(toastObject);
  }

  remove(message) {
    this.toasts = this.toasts.filter(m => m.message !== message);
  }

  activateToast(toast) {
    toast.callback();
    this.remove(toast.message);
  }
}