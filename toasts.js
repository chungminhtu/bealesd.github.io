import { Utilities } from './utilites.js';

export class Toasts {
    constructor() {
        if (!Toasts.instance) {
			this.toasts = [];

			this.utilities = new Utilities();

			Toasts.instance = this;
        }
        return Toasts.instance;     
    }

    addToast(type, message, tag, callback) {
		const id = `${tag}:${this.utilities.uuidv4()}`;
		this.toasts.push(id);
		let index = 0;

		document.querySelector('#toast').innerHTML =
			`<div data-toastid="${id}" class="alert ${type} alert-dismissible">
                ${message}
                <button type="button" class="close">X</button>
		    </div>` + document.querySelector('#toast').innerHTML;

		document.querySelectorAll('.alert').forEach((elem) => {
			const positionFromBottom = (80 * index++);
			elem.style.bottom = `${positionFromBottom}px`;
		})
		
		const toastClose = document.querySelector(`#toast > [data-toastid="${id}"] > button`);
		
		this.utilities.addEvent(toastClose.parentElement.dataset['toastid'], 'click', toastClose, () => {
			const toastId = event.srcElement.parentNode.dataset.toastid;
			this.removeToast(toastId);
			callback('');
		});
	}

    removeToast(toastId) {
		const toastElement = document.querySelector(`#toast > [data-toastid="${toastId}"]`);
		toastElement.remove();
		this.toasts = this.toasts.filter(item => item !== toastId);
	}
	
    clearToasts() {
		document.querySelector('#toast').innerHTML = '';
		this.toasts = [];
	}
}