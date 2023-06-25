import { Component, OnInit, OnDestroy } from '@angular/core'
import { Posts, PostsService } from './posts.service'
import { Observable, Subscription } from 'rxjs'
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor (private posts: PostsService, private auth: AuthService) {}

  posts_: any[] = []
  onLoad = true
  posts$: Observable<any[]>
  private subs: Subscription
  ngOnInit (): void {
    this.posts$ = this.posts.getPosts()
  this.sub2=  this.posts$.subscribe(
      res => {
        this.onLoad = false
        this.processPosts(res)
      },
      error => {
        console.error(error) // Log any errors
      }
    )
  }
  processPosts (posts: Posts[]): void {
    posts.forEach(post => {
      const email = post.email
    this.sub=  this.auth.getUser(email).subscribe(
        user => {
          const postWithUser = {
            post,
            user
          }
          this.posts_.push(postWithUser)
        },
        error => {
          console.error(error) // Log any errors
        }
      )
    })
  }
  private sub:Subscription
  private sub2:Subscription
  ngOnDestroy (): void {
    //  this.posts$.
    this.sub.unsubscribe()
    this.sub2.unsubscribe()
  }
}
