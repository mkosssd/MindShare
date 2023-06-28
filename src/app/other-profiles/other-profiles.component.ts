import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router, Params } from '@angular/router'
import { AuthService } from '../auth/auth.service'
import { Subscription } from 'rxjs'
import { PostsService } from '../home/posts.service'

@Component({
  selector: 'app-other-profiles',
  templateUrl: './other-profiles.component.html',
  styleUrls: ['./other-profiles.component.css']
})
export class OtherProfilesComponent implements OnInit, OnDestroy {
  name: string
  email: string
  bio: string
  profile: string
  userPosts: any
  isLoading = false
  username: string
  noPosts = false
  private subs: Subscription
  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private posts: PostsService
  ) {}
  ngOnInit (): void {
    this.isLoading = true
    this.route.params.subscribe((params: Params) => {
      this.subs = this.auth.getUser(params['email']).subscribe(res => {
        this.name = res[0].name
        this.email = res[0].email
        this.bio = res[0].bio
        this.profile = res[0].profilePic
        if (res[0] && res[0].hasOwnProperty('username')) {
          this.username = res[0].username
        } else {
          this.username = 'NA'
        }
      })
      this.posts.getUserPosts(params['email']).subscribe(res => {
        this.userPosts = res
        if (res.length > 0) {
          this.noPosts = true
        }
        this.isLoading = false
      })
    })
  }
  ngOnDestroy (): void {
    this.subs.unsubscribe()
  }
}
