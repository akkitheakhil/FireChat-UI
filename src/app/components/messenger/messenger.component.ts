import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { ModalController } from '@ionic/angular';
import { send } from 'process';
import { Subject, fromEvent, Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirebaseUser } from 'src/app/models/firebaseUser.model';
import { Messages, MessageText, SendMessage } from 'src/app/models/messages.model';
import { User } from 'src/app/models/user.model';
import { CommonService } from 'src/app/services/common.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss'],
})
export class MessengerComponent implements OnInit, OnDestroy, AfterViewChecked {

  // Data passed in by componentProps
  @Input() uid: string;
  @Input() displayName: string;
  @Input() email: string;
  UserInfo: FirebaseUser;

  $Desstroy = new Subject();
  messageText: string;
  messages: Messages = new Messages();
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;
  messageCollection: Messages[];
  @ViewChild('scrollMe') element: ElementRef;
  constructor(private modalCtrl: ModalController, private commonService: CommonService, private firebaseService: FirebaseService) {
  }

  ngOnInit() {
    console.log(this.uid, this.displayName, this.email);
    this.UserInfo = this.firebaseService.currentUser;
    this.getMessages();
    this.getMessageSubsciptions();

  }

  ngAfterViewChecked(): void {
    this.element.nativeElement.scrollTop = this.element.nativeElement.scrollHeight;
  }

  scrollChatIntoView() {
    const objDiv = document.querySelector(".message-container");
    objDiv.scrollTop = objDiv.scrollHeight;
    console.log(objDiv.scrollIntoView)
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  getMessages() {
    this.messageCollection = JSON.parse(localStorage.getItem('messagesCollection')) || [];
    this.messages = this.messageCollection?.find(col => col.id === this.uid) || new Messages();
    this.setHasRead();
  }

  saveMessages(message: MessageText) {
    const collection: Messages[] = JSON.parse(localStorage.getItem('messagesCollection')) || [];
    if (collection.length <= 0) {
      const newColl: Messages = new Messages();
      newColl.id = this.uid;
      newColl.email = this.email;
      newColl.displayName = this.displayName;
      newColl.messages = [];
      collection.push(newColl);
    }
    collection?.find(col => col.id === this.uid)?.messages?.push(message);
    localStorage.setItem('messagesCollection', JSON.stringify(collection));
  }

  saveNewMessages(message: MessageText) {
    const collection: Messages[] = JSON.parse(localStorage.getItem('messagesCollection')) || [];
    if (collection.length <= 0) {
      const newColl: Messages = new Messages();
      newColl.id = message.senderId;
      newColl.email = message.senderEmail;
      newColl.displayName = message.senderDisplayName;
      newColl.messages = [];
      collection.push(newColl);
    }
    collection?.find(col => col.id === message.senderId)?.messages?.push(message);
    localStorage.setItem('messagesCollection', JSON.stringify(collection));
  }

  getMessageSubsciptions() {
    this.commonService.recieveMessage().pipe(takeUntil(this.$Desstroy)).subscribe((data: MessageText) => {
      console.log(data);
      if (this.messages.id === data.senderId) {
        this.messages.messages.push(data);
      }
      this.saveNewMessages(data);
    });
  }

  sendMessage(text: string) {
    const sendMessage: SendMessage = new SendMessage();
    sendMessage.message = this.messageText;
    sendMessage.recieverEmail = this.email;
    sendMessage.recieverId = this.uid;
    this.commonService.sendMessage(sendMessage).pipe(takeUntil(this.$Desstroy)).subscribe((data: MessageText) => {
      data.hasRead = true;
      this.messages.messages.push(data);
      this.messageText = '';
      this.saveMessages(data);
    });
  }

  setHasRead() {
    if(this.messages?.messages.length>0) {
      this.messageCollection.find(item => item.id === this.messages.id).messages[this.messages?.messages?.length-1].hasRead = true;
      localStorage.setItem('messagesCollection',JSON.stringify(this.messageCollection));
    }
  }


  getPictureUrl(uid): string {
    return `${environment.BASE_FIREBASE_STORAGE_URL}${uid}%2FprofilePicture%2Fprofile?alt=media`;
  }

  ngOnDestroy(): void {
    this.$Desstroy.next();
    this.$Desstroy.complete();
  }

}
