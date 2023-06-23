import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router,Params } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-other-profiles',
  templateUrl: './other-profiles.component.html',
  styleUrls: ['./other-profiles.component.css']
})
export class OtherProfilesComponent implements OnInit  {
  name:string
  constructor(private router:Router,private route:ActivatedRoute,private auth:AuthService){}
  ngOnInit(): void {
    this.route.params.subscribe(
      (params:Params)=>{
        // this.name = params['email']
        this.auth.getUser(params['email']).subscribe(res=>{
          this.name = res[0].name
        })
      }
    )
  }

}
