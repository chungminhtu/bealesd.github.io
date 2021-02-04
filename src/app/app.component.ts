import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

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

  constructor(router: Router) {
    this.date = new Date();

    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (['blog'].includes(event.url.split('/')[1]))
          this.isBlogRoute = true;
        else
          this.isBlogRoute = false;
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
    else if (elem.nodeName === 'A'){
      const a = elem as HTMLAnchorElement
      a.target = "_blank";
    }
  }

  closeModal(){
    this.isModalOpen = false;
  }
}
