import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import Pusher from 'pusher-js/with-encryption';
import { FirebaseService } from './firebase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContactInfo, ContactsData } from '../models/contacts.model';
import { SendMessage } from '../models/messages.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  pusher;
  isNative: boolean = false;
  notificationService = new BehaviorSubject(null);

  constructor(private http: HttpClient, private firebase: FirebaseService) {
    const authToken = firebase.accessToken;
    this.pusher = new Pusher('59ae8920590b277f22dc', {
      cluster: 'ap2',
      authEndpoint: `${environment.BASE_API_URL}/api/v1/user/pusher/auth`,
      auth: {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    });
   }


  recieveMessage() {
    const observable = new Observable(observer => {
      const currentUser = this.firebase.currentUser.uid;
      const channel = this.pusher.subscribe(`private-encrypted-${currentUser}`);
      channel.bind('recieve-messages', (data) => {
        observer.next(
          data
        );
      });
    });
    return observable;
  }

  recieveFriendRequest() {
    const observable = new Observable(observer => {
      const currentUser = this.firebase.currentUser.uid;
      const channel = this.pusher.subscribe(`private-encrypted-${currentUser}`);
      channel.bind('recieve-friend-request', (data) => {
        observer.next(
          data
        );
      });
    });
    return observable;
  }

  recieveRequestAccepted() {
    const observable = new Observable(observer => {
      const currentUser = this.firebase.currentUser.uid;
      const channel = this.pusher.subscribe(`private-encrypted-${currentUser}`);
      channel.bind('recieve-request-accepted', (data) => {
        observer.next(
          data
        );
      });
    });
    return observable;
  }

  findContact(email: string): Observable<ContactInfo> {
    const api_url = environment.BASE_API_URL + '/api/v1/user/findContact';
    return this.http.post<ContactInfo>(api_url, {email});
  }

  getAllContacts(): Observable<ContactsData> {
    const api_url = environment.BASE_API_URL + '/api/v1/user/contacts';
    return this.http.get<ContactsData>(api_url);
  }


  sendFriendRequest(email) {
    const api_url = environment.BASE_API_URL + '/api/v1/user/sendFriendReq';
    return this.http.post(api_url, {email});
  }

  sendMessage(sendMessageReq: SendMessage) {
    const api_url = environment.BASE_API_URL + '/api/v1/user/sendMessage';
    return this.http.post(api_url, sendMessageReq);
  }

  getAllConnectionRequests() {
   const api_url = environment.BASE_API_URL + '/api/v1/user/getConnectionRequests';
   return this.http.get(api_url);
  }

  acceptFriendRequest(_id: string) {
    const api_url = environment.BASE_API_URL + '/api/v1/user/acceptFriendReq';
    return this.http.post(api_url, {_id});
  }

  dismissFriendRequest(_id: string) {
    const api_url = environment.BASE_API_URL + '/api/v1/user/dismissFriendReq';
    return this.http.post(api_url, {_id});
  }


}
