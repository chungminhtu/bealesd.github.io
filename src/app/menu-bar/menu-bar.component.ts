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

  sideMenuHeadingsShown = {
    blogs: false,
    blogTagsShown: {}
  };

  searchId = null;

  searchBarHeight = '50px';

  constructor(
    public blogService: BlogService,
    private router: Router,
    public toastEvents: ToastEvents,
  ) { }

  ngOnInit(): void {
    this.getBlogsByTags();

    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        document.documentElement.style.setProperty('--search-bar-menu-bar-height', '0px');

        const rootPath = window.location.pathname.split('/')[1];
        if (rootPath === 'blog') {
          this.isHomePage = false;
        }
        else if (rootPath === 'home') {
          document.documentElement.style.setProperty('--search-bar-menu-bar-height', this.searchBarHeight);
          this.isHomePage = true;
        }
        else {
          this.isHomePage = true;
        }
      }
    });
  }

  getBlogsByTags() {
    this.tags = this.blogService.blogRepo.getAllUniqueTags();

    for (const tag of this.tags)
      this.sideMenuHeadingsShown.blogTagsShown[tag] = false;
  }

  getBlogsByTag(tag: string) {
    return this.blogService.blogRepo.getBlogsByTags([tag]);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleSideMenuHeading(val: HTMLSpanElement) {
    const sideMenuHeading = val.innerText.trim().toLocaleLowerCase();
    this.sideMenuHeadingsShown[sideMenuHeading] = !this.sideMenuHeadingsShown[sideMenuHeading];
  }

  toggleSideMenuBlogTag(val: HTMLSpanElement) {
    const tag = val.innerText.trim();
    this.sideMenuHeadingsShown.blogTagsShown[tag] = !this.sideMenuHeadingsShown.blogTagsShown[tag];
  }

  filterBlogsBySearch(word) {
    // TODO: move toast adding to blogService
    if (word.trim().length > 0) {
      if (this.searchId === null) {
        const cb = () => {
          this.blogService.filters.words = '';
          const blogs = this.blogService.getCurrentBlogs();
          this.blogService.blogs = blogs;
          this.searchId = null;
          (document.querySelector('#searchInput') as HTMLInputElement).value = '';
        }
        this.searchId = this.toastEvents.addToastMessageInteractive(`Search: ${word}`, cb);
      }
      else {
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
