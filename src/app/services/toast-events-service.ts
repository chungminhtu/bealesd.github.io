import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastEvents {
  toasts = []

  constructor() { }

  addToast(message: string, callback: () => void) {
    const id = this.generateUuid()
    const toast = new Toast(id, message, ToastType.Interactive, callback);
    this.add(toast)
    return id;
  }

  addToastTemporary(message: string): void {
    const id = this.generateUuid();
    const toast = new Toast(id, message, ToastType.Info, async () => { });
    this.add(toast);

    window.setTimeout(() => {
      this.activateToast(toast);
    }, 3000);
  }

  updateToast(id: string, message: string): void {
    const toast = this.get(id);
    toast.message = message;
  }

  deleteToast(id: string): void {
    this.toasts = this.toasts.filter(m => m.id !== id);
  }

  deleteAllToasts(): void {
    this.toasts = [];
  }

  activateToast(toast: Toast): void {
    toast.callback();
    this.deleteToast(toast.id);
  }

  getToast(message: string): Toast{
    return this.toasts.find((toast) => toast.message === message);
  }

  private add(toast: Toast): void {
    const isNewToast = !this.toasts.some(m => m.id === toast.id);
    if (isNewToast)
      this.toasts.push(toast);
  }

  private get(id: string): Toast {
    return this.toasts.find(toast => toast.id === id);
  }

  private generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export enum ToastType {
  Interactive,
  Info
}

export class Toast {
  id: string;
  message: string;
  type: ToastType;
  callback: () => void;

  constructor(id: string, message: string, type: ToastType, callback: () => void) {
    this.id = id;
    this.message = message;
    this.type = type;
    this.callback = callback;
  }
}
