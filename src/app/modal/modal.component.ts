import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Output()
  close = new EventEmitter<boolean>();

  @Input()
  title: string;
  @Input()
  message: string;

  constructor() { }

  ngOnInit(): void { }

  parsedMessage() {
    return this.message.replace("@", '<span class="at-symbol">@</span>');
  }

  closeModal() {
    this.close.emit(false);
  }
}
