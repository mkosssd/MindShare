import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Posts, PostsService } from './posts.service';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  posts_: any[] = [];
  onLoad = true;
  posts$: Observable<any[]>;
  private sub: Subscription;
  private sub2: Subscription;

  constructor(
    private posts: PostsService,
    private auth: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    
    this.posts_ = [];
    this.posts$ = this.posts.getPosts()

    this.sub2 = this.posts$.subscribe(
      res => {
        this.onLoad = false;
        this.processPosts(res);
      },
      error => {
        console.error(error); // Log any errors
      }
    );
  }

  processPosts(posts: any[]): void {
    posts.forEach(post => {
      const email = post.email;

      this.sub = this.auth.getUser(email).subscribe(
        user => {
          const postWithUser = {
            post,
            user
          };
          this.posts_.push(postWithUser);
        },
        error => {
          console.error(error); // Log any errors
        }
      );
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
    if (this.posts_) {
      this.posts_ = [];
    }
    
  }
}
