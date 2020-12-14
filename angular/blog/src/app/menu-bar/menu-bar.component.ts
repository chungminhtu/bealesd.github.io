import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blogs-service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  sidebarOpen: boolean = false;

  constructor(private blogService: BlogService) {
    this.getBlogs();
  }

  ngOnInit(): void {  }

  async getBlogs(){
    await this.blogService.sortByDisplayName(true);
  }

  toggleSidebar(){
    this.sidebarOpen = !this.sidebarOpen;
  }

}
