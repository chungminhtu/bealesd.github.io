import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blogs-service';
import { ToastEvents } from '../services/toast-events-service';
import { Utilities } from '../helpers/utilites'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  utilities: any;

  get blogs() {
    return this.blogService.blogs;
  }

  constructor(
    private blogService: BlogService,
    public toastEvents: ToastEvents
  ) {
    this.utilities = new Utilities;

    this.getBlogs();
  }

  ngOnInit(): void { }

  async getBlogs() {
    const blogs = await this.blogService.getCurrentBlogs();
    this.blogService.blogs = blogs;
  }

  async filterBlogsByTag(tag) {
    const toast = this.toastEvents.toasts.find((toast) => toast.message === `Tag: ${tag}`);
    if (toast !== undefined) {
      this.toastEvents.addToastMessage(`Tag: ${tag}. Already on.`)
      return;
    }

    const callback = async () => {
      this.blogService.filters.tag = '';
      const blogs = await this.blogService.getCurrentBlogs();
      this.blogService.blogs = blogs;
    }
    this.toastEvents.addToastMessageInteractive(`Tag: ${tag}`, callback);

    this.blogService.filters.tag = tag;
    this.blogService.blogs = await this.blogService.getCurrentBlogs();
  }

}
