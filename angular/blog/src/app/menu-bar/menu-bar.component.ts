import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blogs-service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  sidebarOpen: boolean = false;

  blogsByTag = {};
  tags = [];
  tagsShown = {};

  constructor(public blogService: BlogService) {
    this.getBlogsByTags();
  }

  ngOnInit(): void { }

  async getBlogsByTags() {
    this.blogsByTag = await this.blogService.getPostByTags();
    this.tags = Object.keys(this.blogsByTag);

    for (let i = 0; i < this.tags.length; i++) {
      const tag = this.tags[i];
      this.tagsShown[tag] = false;
    }
  }

  getBlogsByTag(tag: string) {
    return this.blogsByTag[tag];
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleSubMenu(evt: MouseEvent) {
    let tag = (<HTMLDivElement>evt.target).innerText.trim();
    this.tagsShown[tag] = !this.tagsShown[tag];
  }

  async filterBlogsBySearch(word) {
    this.blogService.filters.words = word;
    this.blogService.blogs = await this.blogService.getCurrentBlogs();
  }

  async toggleNameSort() {
    this.blogService.sort.current = 'name';
    this.blogService.sort.name = !this.blogService.sort.name;
    this.blogService.blogs = await this.blogService.getCurrentBlogs();
  }

  async toggleTagSort() {
    this.blogService.sort.current = 'tag';
    this.blogService.sort.tag = !this.blogService.sort.tag;
    this.blogService.blogs = await this.blogService.getCurrentBlogs();
  }

  async toggleTimestampSort() {
    this.blogService.sort.current = 'timestamp';
    this.blogService.sort.timestamp = !this.blogService.sort.timestamp;
    this.blogService.blogs = await this.blogService.getCurrentBlogs();
  }

}
