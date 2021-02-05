import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AngularAndGithubPagesComponent } from './blogs/angular-and-github-pages/angular-and-github-pages.component';
import { AsyncConstructorsComponent } from './blogs/async-constructors/async-constructors.component';
import { AzureDeveloperExamNotesComponent } from './blogs/azure-developer-exam-notes/azure-developer-exam-notes.component';
import { EventCrudComponent } from './blogs/event-crud/event-crud.component';
import { JavascriptVariablesAndScopeComponent } from './blogs/javascript-variables-and-scope/javascript-variables-and-scope.component';
import { MarkdownRenderingComponent } from './blogs/markdown-rendering/markdown-rendering.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'blog/JavaScriptVariablesAndScope', component: JavascriptVariablesAndScopeComponent },
  { path: 'blog/EventCRUD', component: EventCrudComponent },
  { path: 'blog/AzureDeveloper204ExamNotes', component: AzureDeveloperExamNotesComponent },
  { path: 'blog/AsyncConstructors', component: AsyncConstructorsComponent },
  { path: 'blog/MarkdownRendering', component: MarkdownRenderingComponent },
  { path: 'blog/AngularAndGitHubPages', component: AngularAndGithubPagesComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
