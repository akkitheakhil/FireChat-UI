import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { error } from 'protractor';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessengerComponent } from 'src/app/components/messenger/messenger.component';
import { Messages, MessageText } from 'src/app/models/messages.model';
import { CommonService } from 'src/app/services/common.service';
import { DataFactoryService } from 'src/app/services/data-factory.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  messageCollection:Messages[] = [];
  $OnDestroy = new Subject();
  isLoading: boolean = true;
  isLoadingContent = [...Array(4).keys()];
  currentState: string;
  constructor(private commonService: CommonService, public modalController: ModalController, private dataFactory: DataFactoryService) { }

  ngOnInit() {
    this.recieveMessage();
    this.getMessages();
    this.connectionState();
  }

  recieveMessage() {
    this.commonService.subscribeToNewMessages.pipe(takeUntil(this.$OnDestroy)).subscribe((data) => {
      if(data) {
        this.getMessages();
      }
    })
  }

  ngAfterViewChecked(): void {
      this.setNotificationRead();
  }

  setNotificationRead() {
    setTimeout(() => {
      this.commonService.notificationService.next({key: 'message', val:false});
    }, 300);
  }

  getMessages() {
    this.messageCollection = this.dataFactory.retriveMessageData;
    this.messageCollection.sort((a,b) => {
      let date1 = new Date(b?.messages[b?.messages?.length-1].timeStamp);
      let date2 = new Date(a?.messages[a?.messages?.length-1].timeStamp);
      return date1.getTime() - date2.getTime();
    });
    this.isLoading = false;
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


  connectionState() {
    this.commonService.pusherConnectionState.pipe(takeUntil(this.$OnDestroy)).subscribe((data) => {
      if(!data?.state) return;
      console.log('Connection State => ', data?.state);
      this.currentState = data?.state;
      if(data?.state === 'Disconnected') {
        window.location.reload();
      }
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.$OnDestroy.next();
    this.$OnDestroy.complete();
  }

}
