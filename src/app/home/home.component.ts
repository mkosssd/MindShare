import { Component, OnInit } from '@angular/core'
import { Posts, PostsService } from './posts.service'
import { Observable } from 'rxjs'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor (private posts: PostsService) {}
  // posts={
  //   userData:{
  //   name:'Manas Khandelwal',
  //   displayPicture:'https://random.imagecdn.app/500/150'},
  //   postText:'Lorem  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quasi eligendi hic. Dolorum ad ipsa, corrupti voluptates illo saepe debitis earum repudiandae rerum perspiciatis, amet aut nesciunt assumenda at ab neque impedit similique iure. lorem343 ipsum dolor sit amet consectetur adipisicing elit. Doloremque ipsum accusantium dolor sapiente! Ducimus illo libero facilis repellat quia laborum odit dignissimos cum, quo autem tempore doloremque ratione veritatis vel animi rerum itaque ex delectus. Asperiores dignissimos impedit natus fugiat sint incidunt, beatae libero aliquam veniam expedita accusamus neque adipisci obcaecati hic accusantium sit!',
  //   postImage:'https://firebasestorage.googleapis.com/v0/b/mindshare-3ab39.appspot.com/o/images%2FScreenshot%202023-06-17%20183301.jpg?alt=media&token=aaf83612-880c-4124-8df6-aa4dee74d435',
  //   timeStamp:new Date
  // }
  onLoad = true
  posts$: Observable<any[]>
  posts_: Posts[] = []
  ngOnInit (): void {
    this.posts$ = this.posts.getPosts()
    this.posts$.subscribe(
      res => {
        this.posts_ = res
        this.onLoad = false
      },
      error => {
        console.error(error) // Log any errors
      }
    )
  }
}
