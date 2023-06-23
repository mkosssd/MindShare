import { Component,OnInit,OnDestroy, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {Subscription} from 'rxjs'
import { UserProfileComponent } from '../user-profile/user-profile.component';

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.css']
})
export class HeaderComponentComponent implements OnInit,OnDestroy {
  isAuth = false
  private userSub:Subscription
  profilePic:string=''
  constructor(public auth:AuthService) {
  }
 ngOnInit(): void {
 this.userSub =  this.auth.user.subscribe(user=>{
    this.isAuth = !!user
    console.log(user)
    this.auth.getUser(user.email).subscribe(res=>{
      if(res[0] && res[0].hasOwnProperty('profilePic')){
        // this.profilePic=res[0].profilePic
      }else{
        this.profilePic="https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200"
      }
    })
  })
   
 }
 ngOnDestroy(): void {
   this.userSub.unsubscribe()
 }
logout(){
  this.auth.logout()
}
// invokeData(){
//   this.user.syncData()
// }

  
}
