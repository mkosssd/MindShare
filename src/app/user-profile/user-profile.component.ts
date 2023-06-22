import { Component, Injectable, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
@Injectable({
  providedIn:'root'
})
export class UserProfileComponent implements OnInit{
  name: string = '';

  constructor(private auth: AuthService) {}
  onLoad=false
  ngOnInit(): void {
    this.onLoad = true
    this.auth.user.subscribe(user => {
      if (user) {
        this.auth.getUser(user.email).subscribe(res => {
          if (res.length > 0) {
            this.name = res[0].name;
            this.onLoad = false
          }
        });
      }
    });
  }
  
}
