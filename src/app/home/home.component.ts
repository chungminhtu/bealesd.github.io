import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlogService } from '../services/blogs-service';
import { ToastEvents } from '../services/toast-events-service';
import { Utilities } from '../helpers/utilites'
import { TagContentType } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  utilities: any;

  get blogs() {
    return this.blogService.blogs;
  }

  constructor(
    private blogService: BlogService,
    public toastEvents: ToastEvents
  ) {
    this.utilities = new Utilities;
  }

  ngOnDestroy(): void {
    this.blogService.resetFilters();
    this.toastEvents.clear();
  }

  ngOnInit(): void {
    this.blogService.resetFilters();
    this.toastEvents.clear();

    this.getBlogs();
  }

  getBlogs() {
    const blogs = this.blogService.getCurrentBlogs();
    this.blogService.blogs = blogs;
  }

  filterBlogsByTag(tag) {
    const toast = this.toastEvents.toasts.find((toast) => toast.message === `Tag: ${tag}`);
    if (toast !== undefined) {
      this.toastEvents.addToastMessage(`Tag: ${tag}. Already on.`)
      return;
    }

    const innerCallback = (tag: string) => {
      this.blogService.filters.tags = this.blogService.filters.tags.filter(t => t !== tag);
      const blogs = this.blogService.getCurrentBlogs();
      this.blogService.blogs = blogs;
    }
    const outerCallback = () => innerCallback(tag);

    this.toastEvents.addToastMessageInteractive(`Tag: ${tag}`, outerCallback);

    this.blogService.filters.tags.push(tag);
    this.blogService.blogs = this.blogService.getCurrentBlogs();
  }

}
