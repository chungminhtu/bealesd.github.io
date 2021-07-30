import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { AngularAndGithubPagesComponent } from './blogs/angular-and-github-pages/angular-and-github-pages.component';
import { EventCrudComponent } from './blogs/event-crud/event-crud.component';
import { MarkdownRenderingComponent } from './blogs/markdown-rendering/markdown-rendering.component';
import { JavascriptVariablesAndScopeComponent } from './blogs/javascript-variables-and-scope/javascript-variables-and-scope.component';
import { AzureDeveloperExamNotesComponent } from './blogs/azure-developer-exam-notes/azure-developer-exam-notes.component';
import { AsyncConstructorsComponent } from './blogs/async-constructors/async-constructors.component';
import { AboutComponent } from './about/about.component';
import { ModalComponent } from './modal/modal.component';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { AngularAndStaticPagesComponent } from './blogs/angular-and-static-pages/angular-and-static-pages.component';

import { DaveModule } from 'projects/dave/src/public-api';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuBarComponent,
    MessageBoxComponent,
    AngularAndGithubPagesComponent,
    EventCrudComponent,
    MarkdownRenderingComponent,
    JavascriptVariablesAndScopeComponent,
    AzureDeveloperExamNotesComponent,
    AsyncConstructorsComponent,
    AboutComponent,
    ModalComponent,
    AngularAndStaticPagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ScullyLibModule,
    DaveModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
