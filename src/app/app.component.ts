import { Component,OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import {Router} from '@angular/router'
import { PostsService } from './home/posts.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MindShare';
  constructor(public auth:AuthService,private posts:PostsService){}
  ngOnInit(): void {
    this.auth.autoLogin()
    this.posts.getPosts().subscribe()
  }

}
