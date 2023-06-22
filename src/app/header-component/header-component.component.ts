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
  constructor(public auth:AuthService,public user:UserProfileComponent) {
    
  }
 ngOnInit(): void {
 this.userSub =  this.auth.user.subscribe(user=>{
    this.isAuth = !!user
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
