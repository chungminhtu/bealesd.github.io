import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blogs-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  get blogs() {
    return this.blogService.blogs;
  }

  constructor(private blogService: BlogService) {
    this.getBlogs();
  }

  ngOnInit(): void { }

  async getBlogs(){
    const blogs = await this.blogService.sortByDisplayName(true);
    this.blogService.blogs = blogs;
  }

}
