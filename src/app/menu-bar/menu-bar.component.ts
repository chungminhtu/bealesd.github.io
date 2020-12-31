import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BlogService } from '../services/blogs-service';
import { ToastEvents } from '../services/toast-events-service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  isHomePage = false;

  sidebarOpen: boolean = false;

  blogsByTag = {};
  tags = [];
  tagsShown = {};

  searchId = null;

  constructor(
    public blogService: BlogService,
    private router: Router,
    public toastEvents: ToastEvents
  ) {
    this.getBlogsByTags();

    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        const rootPath = window.location.pathname.split('/')[1]
        if (rootPath=== 'blog')
          this.isHomePage = false;
        else if (rootPath=== '/home')
          this.isHomePage = true;
        else
          this.isHomePage = true;
      }
    });
  }

  ngOnInit(): void { }

  getBlogsByTags() {
    // this.blogsByTag = this.blogService.blogRepo.getAllUniqueTags();
    this.tags = this.blogService.blogRepo.getAllUniqueTags();

    // this.blogService.getPostByTags();
    // this.tags = Object.keys(this.blogsByTag);

    for (const tag of this.tags) {
      this.tagsShown[tag] = false;
    }
  }

  getBlogsByTag(tag: string) {
    // todo - unsorted
    return this.blogService.blogRepo.getBlogsByTags([tag]);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleSubMenu(evt: MouseEvent) {
    let tag = (<HTMLDivElement>evt.target).innerText.trim();
    this.tagsShown[tag] = !this.tagsShown[tag];
  }

  filterBlogsBySearch(word) {
    // todo: move toast adding to blogService
    if(word.trim().length > 0){
      if(this.searchId === null){
        const cb = () => {
          this.blogService.filters.words = '';
          const blogs = this.blogService.getCurrentBlogs();
          this.blogService.blogs = blogs;
          this.searchId = null;
          (document.querySelector('#searchInput') as HTMLInputElement).value = '';
        }
        this.searchId = this.toastEvents.addToastMessageInteractive(`Search: ${word}`, cb);
      }
      else{
        this.toastEvents.updateToastMessage(this.searchId, `Search: ${word}`);
      }
    }
    else {
      this.toastEvents.remove(this.searchId);
      this.searchId = null;
    }

    this.blogService.filters.words = word;
    this.blogService.blogs = this.blogService.getCurrentBlogs();
  }

  toggleNameSort() {
    this.blogService.sort.current = 'name';
    this.blogService.sort.name = !this.blogService.sort.name;
    this.blogService.blogs = this.blogService.getCurrentBlogs();
  }

  toggleTagSort() {
    this.blogService.sort.current = 'tag';
    this.blogService.sort.tag = !this.blogService.sort.tag;
    this.blogService.blogs = this.blogService.getCurrentBlogs();
  }

  toggleTimestampSort() {
    this.blogService.sort.current = 'timestamp';
    this.blogService.sort.timestamp = !this.blogService.sort.timestamp;
    this.blogService.blogs = this.blogService.getCurrentBlogs();
  }

}
