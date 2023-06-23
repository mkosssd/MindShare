import { Component, Injectable, OnInit,OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';
import { AngularFirestore, docChanges } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
@Injectable({
  providedIn:'root'
})
export class UserProfileComponent implements OnInit,OnDestroy{
  name: string = '';
  email:string=''
  profilePic=''
  bio=''
  age:number
  gender='female'
  constructor(private auth: AuthService,private firestoreDB:AngularFirestore,private router:Router) {}
  onLoad=false
  ngOnInit(): void {
    // this.onLoad = true
    this.auth.user.subscribe(user => {
      if (user) {
        this.auth.getUser(user.email).subscribe(res => {
          if (res.length > 0) {
            this.name = res[0].name;
            this.email=res[0].email
            this.age  = +res[0].age
            this.bio = res[0].bio
            if(res[0] && res[0].hasOwnProperty('profilePic')){
              this.profilePic=res[0].profilePic
            }else{
              this.profilePic="https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200"
            }
            this.onLoad = false
          }
        });
      }
    });
  }
  change(){
    document.getElementById('upload').click()
  }  
  editMode=false
  editModeFunc(){
    this.editMode=!this.editMode
  }
  //  unsub:Subscription
  editServ(form:NgForm){
    console.log(form.value)
    const age = form.value.age
    const bio = form.value.bio
    const userD= 'UserData'
  const query =   this.firestoreDB.collection('UserData',ref=>ref.where('email','==',this.email))
   query.snapshotChanges().subscribe(
    querySnap=>{
      querySnap.forEach(docChange=>{
        const docId=docChange.payload.doc.id
        this.firestoreDB.doc(`${userD}/${docId}`).update({
          bio:bio,
          age:age
          
        })
      })
    }
    )
    this.router.navigate(['profile'])
  // this.unsub.unsubscribe()
  }
  ngOnDestroy(): void {
    // this.unsub.unsubscribe()
  }
}
