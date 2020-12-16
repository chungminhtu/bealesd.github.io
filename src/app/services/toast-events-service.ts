import { Injectable } from '@angular/core';
import { Utilities } from '../helpers/utilites'

@Injectable({
  providedIn: 'root',
})
export class ToastEvents {
  toasts = []
  utilities: Utilities;

  constructor() {
    this.utilities = new Utilities;
   }

  private add(toastObject) {
    const toast = this.toasts.find(m => m.id === toastObject.id);
    const isNewToast = toast === undefined;
    if (isNewToast)
      this.toasts.push(toastObject);
  }

  addToastMessageInteractive(message, callback) {
    const id =  this.utilities.uuidv4()
    this.add(
      {
        id: id,
        message: message,
        type: 'interactive',
        callback: callback
      }
    )
    return id;
  }

  updateToastMessage(id, message){
    const toast = this.get(id);
    toast.message = message;
  }

  addToastMessage(message){
    const id = this.utilities.uuidv4();
    this.add(
      {
        id: id,
        message: message,
        type: 'info',
        callback: async () => { }
      }
    )
    window.setTimeout(() => {
      const toast = this.get(id);
      this.activateToast(toast);
    }, 3000);
  }

  remove(id) {
    this.toasts = this.toasts.filter(m => m.id !== id);
  }

  get(id){
    return this.toasts.find(m => m.id === id);
  }

  activateToast(toast) {
    toast.callback();
    this.remove(toast.id);
  }
}