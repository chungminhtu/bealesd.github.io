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
    const toast = this.toastEvents.toasts.find((toast)=> toast.message === tag);
    if (toast !== undefined)
      return window.alert('Tag already applied!');
    
    this.toastEvents.add(
      {
        id: this.utilities.uuidv4(),
        message: tag,
        callback: async () => {
          this.blogService.filters.tag = '';
          const blogs = await this.blogService.getCurrentBlogs();
          this.blogService.blogs = blogs;
        }
      }
    )
    this.blogService.filters.tag = tag;
    this.blogService.blogs = await this.blogService.getCurrentBlogs();
  }

}
