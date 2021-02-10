import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { BlogRepo } from './services/blogRepo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  HOME_PAGE_DESCRIPTION = 'A software engineering blog by David Beales. Mosts posts are Angular, TypScript, and JavaScript related.';
  ABOUT_PAGE_DESCRIPTION = 'My name is David Beales and I am a software developer at UKHO. You can find me on linkedIn.';
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
    private meta: Meta,
    private blogRepo: BlogRepo
  ) {
    this.date = new Date();

    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (['blog'].includes(event.url.split('/')[1])) this.isBlogRoute = true;
        else this.isBlogRoute = false;

        this.selectPageDescription(event);
      }
    });
  }

  selectPageDescription(event: NavigationStart) {
    const path = event.url.split('/')[1];
    if (['home'].includes(path))
      this.setPageDescription(this.HOME_PAGE_DESCRIPTION);

    else if (['about'].includes(path))
      this.setPageDescription(this.ABOUT_PAGE_DESCRIPTION);

    else if (['blog'].includes(path)) {
      const blogId = event.url.split('/')[2];
      const summary = this.blogRepo.getBlogById(blogId).summary;
      this.setPageDescription(summary);
    }
  }

  setPageDescription(description: string) {
    this.scully.getCurrent().subscribe(() => {
      this.meta.updateTag({ name: 'description', property: 'description', content: description })
    });
  }

  expandImage(evt: Event) {
    let elem = (evt.target as HTMLElement);

    if (elem.nodeName === 'IMG' && elem.classList.contains('blog-image')) {
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
