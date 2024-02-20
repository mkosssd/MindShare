import { Component, OnInit, OnDestroy } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { PostsService } from './posts.service'
import { AuthService } from '../auth/auth.service'
import { Meta, Title } from '@angular/platform-browser'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  posts_: any[] = []
  onLoad = true
  posts$: Observable<any[]>

  private sub: Subscription
  private sub2: Subscription

  constructor (private posts: PostsService, private auth: AuthService, private metaService: Meta, private titleService: Title, private modalService: NgbModal) {}
  currentUser: any
  ngOnInit (): void {
    this.auth.user.subscribe(res => {
      this.currentUser = res?.email
    })
    this.posts_ = []
    this.posts$ = this.posts.getPosts()
    this.sub2 = this.posts$.subscribe(
      res => {
        this.onLoad = false
        res.forEach(liked => {
          if (
            Array.isArray(liked.likedBy) &&
            liked.likedBy.includes(this.currentUser)
          ) {
            liked.isliked = true
          } else {
            liked.isliked = false
          }
        }, this.processPosts(res))
		this.sub2.unsubscribe()
    this.generatePageMeta()
      },
      error => {
        console.error(error)
		this.sub2.unsubscribe()
      }
    )
  }
  processPosts (posts: any[]): void {
    posts.forEach(post => {
      const email = post.email

      this.sub = this.auth.getUser(email).subscribe(
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

  ngOnDestroy (): void {
    if (this.sub) {
      this.sub.unsubscribe()
    }
    if (this.sub2) {
      this.sub2.unsubscribe()
    }
    if (this.posts_) {
      this.posts_ = []
    }
  }
  toggleLike (post: any) {
    const postId = post.post.postId
    post.isClassActive = !post.isClassActive
    if (!post.post.isliked) {
      post.post.likes++
      this.posts.toggleLikes(postId, post.post.likes, this.currentUser, 'add')
      post.post.isliked = !post.post.isliked
    } else {
      post.post.likes--
      post.post.isliked = !post.post.isliked
      this.posts.toggleLikes(
        postId,
        post.post.likes,
        this.currentUser,
        'remove'
      )
    }
  
  }
  // commentButton=false
    // toggleComment(post){
    //   post.commentButton=!post.commentButton
    // }

    // forComment(comment,post,postId){
    //   this.posts.comment(comment.value.comment,post.post.comments,postId,this.currentUser)
      
    // }
    private generatePageMeta(){
      let title = 'Home | MindShare'
      this.titleService.setTitle(title)
      let description = 'See Other Users Posts & Interact With Them | MindShare'
			this.metaService.updateTag({ name: 'description', content: description });
    }
    modalData:any
    openModal(postModal:any, arrayIndex){
      this.modalData = this.posts_[arrayIndex]
      this.modalService.open(postModal, {centered: true, size: 'md'})
      
    }
  }