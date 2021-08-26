import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbToastsService {

  constructor() { }
}

@Injectable({
  providedIn: 'root',
})
export class ToastEvents {
  toasts = new BehaviorSubject([]);
  toastsStore = [];

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
    this.toasts.next(this.toastsStore);
  }

  deleteToast(id: string): void {
    this.toastsStore = this.toastsStore.filter(m => m.id !== id);
    this.toasts.next(this.toastsStore);
  }

  deleteAllToasts(): void {
    this.toastsStore = [];
    this.toasts.next(this.toastsStore);
  }

  activateToast(toast: Toast): void {
    toast.callback();
    this.deleteToast(toast.id);
  }

  getToast(message: string): Toast {
    return this.toastsStore.find((toast) => toast.message === message);
  }

  private add(toast: Toast): void {
    const isNewToast = !this.toastsStore.some(m => m.id === toast.id);
    if (isNewToast) {
      this.toastsStore.push(toast);
      this.toasts.next(this.toastsStore);
    }
  }

  private get(id: string): Toast {
    return this.toastsStore.find(toast => toast.id === id);
  }

  private generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
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
