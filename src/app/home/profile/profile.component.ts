import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ConnectionRequest } from 'src/app/models/contacts.model';
import { FirebaseUser } from 'src/app/models/firebaseUser.model';
import { CommonService } from 'src/app/services/common.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, AfterViewChecked {

  userInfo: FirebaseUser;
  coonectionRequests: ConnectionRequest[] = [];
  constructor(private commonService: CommonService, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.userInfo = this.firebaseService.currentUser;
    this.getAllConnectionRequest();
  }

  ngAfterViewChecked(): void {
    this.setNotificationRead();
  }


  setNotificationRead() {
    setTimeout(() => {
      this.commonService.notificationService.next({ key: 'friendReq', val: false });
    }, 300);
  }

  getAllConnectionRequest() {
    this.commonService.getAllConnectionRequests().subscribe((data: ConnectionRequest[]) => {
      this.coonectionRequests = data || [];
    });
  }

  accept(_id: string) {
    this.commonService.acceptFriendRequest(_id).subscribe((data) => {
      this.coonectionRequests = this.coonectionRequests.filter(item => item._id !== _id);
    });
  }

  dismiss(_id: string) {
    this.commonService.dismissFriendRequest(_id).subscribe((data) => {
      this.coonectionRequests = this.coonectionRequests.filter(item => item._id !== _id);
    });
  }

  async onFileSelected(event) {
    const file = event.target.files[0];
    const url = await this.firebaseService.uploadProfilePicture(file);
    this.firebaseService.updateProfilePicture(url);
    console.log(url);
  }


  getPictureUrl(uid): string {
    return `${environment.BASE_FIREBASE_STORAGE_URL}${uid}%2FprofilePicture%2Fprofile?alt=media`;
  }

}
