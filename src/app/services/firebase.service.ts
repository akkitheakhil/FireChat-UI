import { Injectable } from '@angular/core';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { sha256 } from 'js-sha256';
import { FirebaseUser } from '../models/firebaseUser.model';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { DataFactoryService } from './data-factory.service';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  userData;

  constructor(
    public afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private db: AngularFirestore) {
    this.checkAuthState();
  }

  async login(email: string, password: string) {
    const res =  await this.afAuth.signInWithEmailAndPassword(email, this.hashToSha256(password));
    localStorage.setItem('user', JSON.stringify(res?.user));
    return res?.user;
  }

  async register(displayName: string, email: string, password: string) {
   const res = await this.afAuth.createUserWithEmailAndPassword(email, this.hashToSha256(password));
   await res.user.updateProfile({ displayName: displayName });
   await res.user.sendEmailVerification();
   return res?.user;
  }

  async logout() {
    const res = await this.afAuth.signOut();
    this.userData = null;
    this.clearAllUserData();
    return true;
  }

  get currentUser(): FirebaseUser {
    const user: FirebaseUser = JSON.parse(localStorage.getItem('user'))
    return user;
  }

  get accessToken(): string {
    const user: FirebaseUser = JSON.parse(localStorage.getItem('user'));
    if(!user) return;
    return user?.stsTokenManager.accessToken;
  }

  hashToSha256(plaintext: string): string {
    const hashed = sha256(plaintext);
    return hashed;
  }

  async uploadProfilePicture(file) {
    return new Promise<string>((resolve, reject) => {
      const filePath = `${this.currentUser.uid}/profilePicture/profile`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      task.snapshotChanges()
      .pipe(
        finalize(() => {
          console.log('upload complete');
          const downloadURL =  fileRef.getDownloadURL();
          downloadURL.subscribe((url) => {
            resolve(url);
          });
        })).subscribe()
    });
  }


  checkAuthState() {
    this.afAuth.authState.subscribe((user) => {
      if(user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        this.userData = null;
        localStorage.setItem('user', JSON.stringify(this.userData));
      }
    });
  }

  clearAllUserData() {
    localStorage.setItem('user', JSON.stringify(null));
    localStorage.setItem('messagesCollection', JSON.stringify([]));
    localStorage.setItem('favs', JSON.stringify([]));
  }

  updateProfilePicture(url) {
    this.afAuth.authState.subscribe((user) => {
      user.updateProfile({photoURL: url});
    })
  }

}
