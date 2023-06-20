import { Component,OnInit,OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {Subscription} from 'rxjs'

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.css']
})
export class HeaderComponentComponent implements OnInit,OnDestroy {
  isAuth = false
  private userSub:Subscription
  constructor(public auth:AuthService) {
    
  }
 ngOnInit(): void {
 this.userSub =  this.auth.user.subscribe(user=>{
    this.isAuth = !!user
    console.log(this.isAuth)
    console.log(this.auth)
  })
   
 }
 ngOnDestroy(): void {
   this.userSub.unsubscribe()
 }
logout(){
  this.auth.logout()
}

  
}
