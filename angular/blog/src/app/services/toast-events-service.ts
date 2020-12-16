import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastEvents {
  toasts = []

  constructor() { }

  add(toastObject) {
    const toast = this.toasts.find(m => m.id === toastObject.id);
    const isNewToast = toast === undefined;
    if (isNewToast)
      this.toasts.push(toastObject);
  }

  remove(id) {
    this.toasts = this.toasts.filter(m => m.id !== id);
  }

  activateToast(toast) {
    toast.callback();
    this.remove(toast.id);
  }
}