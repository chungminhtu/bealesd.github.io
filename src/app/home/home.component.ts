import { Component, OnDestroy, OnInit } from '@angular/core';

import { BlogService } from '../services/blogs-service';
import { Utilities } from '../helpers/utilites';
import { ToastEvents } from 'projects/dave/src/public-api';

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
    public toastEvents: ToastEvents,
  ) {
    this.utilities = new Utilities;
  }

  ngOnDestroy(): void {
    this.blogService.resetFilters();
    this.toastEvents.deleteAllToasts();
  }

  ngOnInit(): void {
    this.blogService.resetFilters();
    this.toastEvents.deleteAllToasts();

    this.getBlogs();
  }

  getBlogs() {
    const blogs = this.blogService.getCurrentBlogs();
    this.blogService.blogs = blogs;
  }

  filterBlogsByTag(tag) {
    const toast = this.toastEvents.getToast(`Tag: ${tag}`);
    if (toast) {
      this.toastEvents.addToastTemporary(`Tag: ${tag}. Already on.`)
      return;
    }

    this.toastEvents.addToast(`Tag: ${tag}`, ()=>{
      this.blogService.filters.tags = this.blogService.filters.tags.filter(t => t !== tag);
      const blogs = this.blogService.getCurrentBlogs();
      this.blogService.blogs = blogs;
    });

    this.blogService.filters.tags.push(tag);
    this.blogService.blogs = this.blogService.getCurrentBlogs();
  }

}
