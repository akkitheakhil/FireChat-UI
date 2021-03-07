import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirebaseUser } from 'src/app/models/firebaseUser.model';
import { Messages, MessageText, SendMessage } from 'src/app/models/messages.model';
import { CommonService } from 'src/app/services/common.service';
import { DataFactoryService } from 'src/app/services/data-factory.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss'],
})
export class MessengerComponent implements OnInit, OnDestroy, AfterViewInit {

  // Data passed in by componentProps
  @Input() uid: string;
  @Input() displayName: string;
  @Input() email: string;
  UserInfo: FirebaseUser;

  $Desstroy = new Subject();
  messageText: string;
  messages: Messages = new Messages();
  messageCollection: Messages[];
  @ViewChild('scrollMe') element: ElementRef;

  constructor(
    private modalCtrl: ModalController,
    private commonService: CommonService,
    private firebaseService: FirebaseService,
    public actionSheetController: ActionSheetController,
    private dataFactory: DataFactoryService
    ) {
  }

  ngOnInit() {
    console.log(this.uid, this.displayName, this.email);
    this.UserInfo = this.firebaseService.currentUser;
    this.getMessages();
    this.getMessageSubsciptions();
  }

  ngAfterViewInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    setTimeout(() => {
      this.element.nativeElement.scrollTop = this.element.nativeElement.scrollHeight;
    }, 100);
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  getMessages() {
    this.messageCollection = [];
    this.messageCollection = this.dataFactory.retriveMessageData;
    this.messages = this.messageCollection?.find(col => col.id === this.uid) || new Messages();
    this.setHasRead();
    this.scrollTop();
  }

  sendMessage() {
    if(this.messageText) {
      const sendMessage: SendMessage = new SendMessage();
      sendMessage.message = this.messageText;
      sendMessage.recieverEmail = this.email;
      sendMessage.recieverId = this.uid;
      sendMessage.recieverDisplayName = this.displayName;

      this.messageText = '';
      this.commonService.sendMessage(sendMessage).pipe(takeUntil(this.$Desstroy)).subscribe((data: MessageText) => {
        data.hasRead = true;
        this.dataFactory.storeOneMessageData = data;
      });
    }
  }

  getMessageSubsciptions() {
    this.commonService.subscribeToNewMessages.pipe(takeUntil(this.$Desstroy)).subscribe((data: MessageText) => {
      if(data) {
        this.getMessages();
      }
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

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      cssClass: 'custom-action-message',
      mode: 'ios',
      buttons: [{
        text: 'Clear Chat',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
         this.clearChatFromStorage();
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  clearChatFromStorage() {
    this.dataFactory.clearChat(this.uid);
    this.messageCollection = [];
    this.messages = new Messages();
    this.scrollTop();
  }

  ngOnDestroy(): void {
    this.$Desstroy.next();
    this.$Desstroy.complete();
  }

}
