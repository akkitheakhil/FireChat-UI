import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { error } from 'protractor';
import { MessengerComponent } from 'src/app/components/messenger/messenger.component';
import { Messages, MessageText } from 'src/app/models/messages.model';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  messageCollection:Messages[] = [];
  constructor(private commonService: CommonService, public modalController: ModalController) { }

  ngOnInit() {
    this.recieveMessage();
    this.getMessages();
  }

  recieveMessage() {
    try {
      this.commonService.recieveMessage().subscribe((data: MessageText) => {
        this.saveNewMessage(data);
      }, error => {
        console.log('Error', error)
        window.location.reload();
      })
    } catch (error) {
      console.log('Error', error)
      window.location.reload();
    }
  }

  ngAfterViewChecked(): void {
      this.setNotificationRead();
  }

  setNotificationRead() {
    setTimeout(() => {
      this.commonService.notificationService.next({key: 'message', val:false});
    }, 300);
  }

  saveNewMessage(data: MessageText) {
    const collection: Messages[] = JSON.parse(localStorage.getItem('messagesCollection')) || [];
    if (collection.length <= 0) {
      const newColl: Messages = new Messages();
      newColl.id = data.senderId;
      newColl.email = data.senderEmail;
      newColl.displayName = data.senderDisplayName;
      newColl.messages = [];
      collection.push(newColl);
    }
    collection?.find(col => col.id === data.senderId)?.messages?.push(data);
    localStorage.setItem('messagesCollection', JSON.stringify(collection));
    this.getMessages();
  }

  getMessages() {
    this.messageCollection = JSON.parse(localStorage.getItem('messagesCollection')) || [];
    this.messageCollection.sort((a,b) => {
      let date1 = new Date(b?.messages[b?.messages?.length-1].timeStamp);
      let date2 = new Date(a?.messages[a?.messages?.length-1].timeStamp);
      return date1.getTime() - date2.getTime();
    })
  }

  async openMessage(id, displayName,email) {
    const modal = await this.modalController.create({
      component: MessengerComponent,
      cssClass: 'custom-ion-modal',
      componentProps: {
        'uid': id,
        'displayName': displayName,
        'email': email
      }
    });
    return await modal.present();
  }

  getPictureUrl(uid): string {
    return `${environment.BASE_FIREBASE_STORAGE_URL}${uid}%2FprofilePicture%2Fprofile?alt=media`;
  }


}
