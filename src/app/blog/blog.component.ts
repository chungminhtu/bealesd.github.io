import { Component,  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  html: any
  isModalOpen = false;
  imgSrc: string;
  blogName: string;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe(params => {
      this.blogName = params.get('blogName');
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
