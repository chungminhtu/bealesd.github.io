import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { ScullyRoutesService } from '@scullyio/ng-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'blog';
  date: Date;
  isBlogRoute: boolean;

  //TODO put in own component
  isModalOpen = false;
  imgSrc: string;
  blogName: string;

  constructor(
    router: Router,
    private scully: ScullyRoutesService,
    private meta: Meta
  ) {
    this.date = new Date();

    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (['blog'].includes(event.url.split('/')[1]))
          this.isBlogRoute = true;
        else
          this.isBlogRoute = false;

        if (['home'].includes(event.url.split('/')[1])) {
          this.scully.getCurrent().subscribe(() => {
            this.meta.updateTag({ name: 'description', property: 'description', content: 'A software engineering blog by David Beales. Mosts posts are Angular, TypScript, and JavaScript related.' })
          });

        }
      }
    });
  }

  expandImage(evt: Event) {
    let elem = (evt.target as HTMLElement);

    if (elem.nodeName === 'IMG') {
      const img = elem as HTMLImageElement;
      this.imgSrc = img.src;
      this.isModalOpen = true;
    }
    else if (elem.nodeName === 'A') {
      const a = elem as HTMLAnchorElement
      a.target = "_blank";
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
