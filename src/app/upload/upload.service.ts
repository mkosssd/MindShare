import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  user: string;
  userName: string;

  constructor(private firestore: AngularFirestore, private auth: AuthService) {}

  upload(caps: string, imgPath: string) {
    this.auth.user.subscribe(res => {
      this.auth.getUser(res.email).subscribe(userRes => {
        console.log(userRes[0].name + "Dsdsds");
        this.user = userRes[0].email;
        this.userName = userRes[0].name;

        this.firestore.collection('posts').add({
          email: this.user,
          caption: caps,
          path: imgPath,
          name: this.userName,
          date: new Date().getTime()
        })
        .then(() => {
          console.log('Document successfully written.');
        })
        .catch(error => {
          console.error('Error writing document: ', error);
        });
      });
    });
  }
}