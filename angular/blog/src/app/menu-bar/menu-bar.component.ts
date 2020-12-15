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

  constructor(private blogService: BlogService) {
    this.getBlogsByTags();
  }

  ngOnInit(): void { }

  async getBlogsByTags() {
    this.blogsByTag = await this.blogService.getPostByTags();
    this.tags = Object.keys(this.blogsByTag);
  }

  getBlogsByTag(tag: string) {
    return this.blogsByTag[tag];
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleSubMenu(evt: MouseEvent) {
    const subHeaders = (<HTMLDivElement>evt.target).parentElement.querySelector('.sidebar-sub-headers');
    if (subHeaders.classList.contains('sidebar-sub-headers-hidden'))
      subHeaders.classList.remove('sidebar-sub-headers-hidden');
    else
      subHeaders.classList.add('sidebar-sub-headers-hidden');
  }

}
