import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirebaseUser } from '../models/firebaseUser.model';
import { CommonService } from '../services/common.service';
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

  constructor(private afAuth: FirebaseService, private router: Router, private commonService: CommonService,private cdr: ChangeDetectorRef) {}


  ngOnInit(): void {
    this.user = this.afAuth.currentUser;
    if(!this.user) this.router.navigate(['getstarted']);
    this.getNotifications();
    this.subscriptToNotifications();
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
      this.commonService.recieveMessage().pipe(takeUntil(this.$OnDestroy)).subscribe((data) => {
        this.setNotificationBadge({key: 'message', val: true});
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

  navChange(value) {
    this.currentNav = value;
  }

  ngOnDestroy(): void {
    this.$OnDestroy.next();
    this.$OnDestroy.complete();
  }


}
