import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blogs-service';
import { ToastEvents } from '../services/toast-events-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  get blogs() {
    return this.blogService.blogs;
  }

  constructor(
    private blogService: BlogService,
    public toastEvents: ToastEvents
  ) {
    this.getBlogs();
  }

  ngOnInit(): void { }

  async getBlogs() {
    const blogs = await this.blogService.getCurrentBlogs();
    this.blogService.blogs = blogs;
  }

  async filterBlogsByTag(tag) {
    this.toastEvents.add(
      {
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
