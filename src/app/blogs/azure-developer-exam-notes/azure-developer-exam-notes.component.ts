import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-azure-developer-exam-notes',
  templateUrl: './azure-developer-exam-notes.component.html',
  styleUrls: ['./azure-developer-exam-notes.component.css']
})
export class AzureDeveloperExamNotesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window['Prism'].highlightAll();
  }

}
