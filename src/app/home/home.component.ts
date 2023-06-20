import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

posts={
  userData:{
  name:'Manas Khandelwal',
  displayPicture:'https://random.imagecdn.app/500/150'},
  postText:'Lorem  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quasi eligendi hic. Dolorum ad ipsa, corrupti voluptates illo saepe debitis earum repudiandae rerum perspiciatis, amet aut nesciunt assumenda at ab neque impedit similique iure. lorem343 ipsum dolor sit amet consectetur adipisicing elit. Doloremque ipsum accusantium dolor sapiente! Ducimus illo libero facilis repellat quia laborum odit dignissimos cum, quo autem tempore doloremque ratione veritatis vel animi rerum itaque ex delectus. Asperiores dignissimos impedit natus fugiat sint incidunt, beatae libero aliquam veniam expedita accusamus neque adipisci obcaecati hic accusantium sit!',
  postImage:'https://source.unsplash.com/random',
  timeStamp:new Date
}
}
