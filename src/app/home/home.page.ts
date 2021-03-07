import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirebaseUser } from '../models/firebaseUser.model';
import { MessageText } from '../models/messages.model';
import { CommonService } from '../services/common.service';
import { DataFactoryService } from '../services/data-factory.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy{

  user: FirebaseUser;
  $OnDestroy = new Subject();

  messageBadge: boolean = false;
  contactBadge: boolean = false;
  friendRequest: boolean = false;
  currentNav = 'dashboard';
  currentState: string;
  constructor(
    private afAuth: FirebaseService,
    private router: Router,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private dataFactory: DataFactoryService
    ) {}

  ngOnInit(): void {
    this.user = this.afAuth.currentUser;
    if(!this.user) this.router.navigate(['getstarted']);
    this.getNotifications();
    this.subscriptToNotifications();
    console.log()
    const routeArr = this.router.url.split('/');
    this.currentNav = routeArr[routeArr.length-1];
    this.commonService.pusherConnectionStateSubscription();
    this.connectionState();
  }

  getNotifications() {
    this.commonService.notificationService.pipe(takeUntil(this.$OnDestroy)).subscribe((data) => {
      if(data) {
        this.setNotificationBadge(data);
      }
    })
  }

  setNotificationBadge({key, val}) {
    switch (key) {
      case 'message':
        this.messageBadge = val;
        break;
      case 'contact':
        this.contactBadge = val;
        break;
      case 'friendReq':
        this.friendRequest = val;
        break;
      default:
        break;
    }
  }

  subscriptToNotifications() {
    this.subscribeToMessages();
    this.subscribeToContacts();
    this.subscribeToFriendReq();
  }

  subscribeToMessages() {
    try {
      this.commonService.recieveMessage().pipe(takeUntil(this.$OnDestroy)).subscribe((data: MessageText) => {
        this.setNotificationBadge({key: 'message', val: true});
        this.dataFactory.storeOneMessageData = data;
      });
    } catch (error) {

    }
  }

  subscribeToContacts() {
    try {
      this.commonService.recieveRequestAccepted().pipe(takeUntil(this.$OnDestroy)).subscribe((data) => {
        this.setNotificationBadge({key: 'contact', val: true});
      });
    } catch (error) {

    }
  }

  subscribeToFriendReq() {
    try {
      this.commonService.recieveFriendRequest().pipe(takeUntil(this.$OnDestroy)).subscribe((data) => {
        this.setNotificationBadge({key: 'friendReq', val: true});
      });
    } catch (error) {

    }
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

  navChange(value) {
    this.currentNav = value;
  }

  ngOnDestroy(): void {
    this.$OnDestroy.next();
    this.$OnDestroy.complete();
  }


}
