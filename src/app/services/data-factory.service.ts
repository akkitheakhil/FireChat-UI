import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { Messages, MessageText } from '../models/messages.model';
import { CommonService } from './common.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class DataFactoryService {

  constructor(
    private firebaseService: FirebaseService,
    private commonService: CommonService
    ) {}

  get retriveMessageData():Messages[] {
    return  JSON.parse(localStorage.getItem('messagesCollection')) || [];
  }

  set storeMessageData(messagesCol: Messages[]) {
    localStorage.setItem('messagesCollection', JSON.stringify(messagesCol));
  }

  set storeOneMessageData(message: MessageText) {
    const collection: Messages[] = this.retriveMessageData || [];
    const user = this.firebaseService.currentUser;
    const id = user.uid === message.senderId ? message.recieverId : message.senderId;
    const index = collection.findIndex(col => col.id === id);
    if(index > -1) {
      collection[index].messages?.push(message);
    } else {
      const newColl: Messages = this.createNewMessage(message);
      collection.push(newColl);
    }
    localStorage.setItem('messagesCollection', JSON.stringify(collection));
    this.commonService.subscribeToNewMessages.next(true);
  }

  createNewMessage(message: MessageText): Messages {
    const newColl: Messages = new Messages();
    const user = this.firebaseService.currentUser;
    if(message.senderId === user.uid) {
      newColl.id = message.recieverId;
      newColl.email = message.recieverEmail;
      newColl.displayName = message.recieverDisplayName;
    } else {
      newColl.id = message.senderId;
      newColl.email = message.senderEmail;
      newColl.displayName = message.senderDisplayName;
    }
    newColl.messages.push(message);
    return newColl;
  }

  clearChat(id) {
    const collection = this.retriveMessageData;
    const newcollection =  collection?.filter(col => col.id !== id) || [];
    this.storeMessageData = newcollection;
  }

  get retriveFavContacts(): string[] {
    return JSON.parse(localStorage.getItem('favContacts')) || [];
  }

  set addFavContact(uid: string) {
    const favContacts = JSON.parse(localStorage.getItem('favContacts')) || [];
    favContacts.push(uid);
    localStorage.setItem('favContacts', JSON.stringify(favContacts));
  }

  deleteFavContact(uid: string) {
    const favContacts: string[] = JSON.parse(localStorage.getItem('favContacts')) || [];
    const newFavContacts = [];
    newFavContacts.push(...favContacts.filter(id => { id !== uid}));
    localStorage.setItem('favContacts', JSON.stringify(newFavContacts));
  }


}
