import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContactInfo } from 'src/app/models/contacts.model';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contactsearch',
  templateUrl: './contactsearch.component.html',
  styleUrls: ['./contactsearch.component.scss'],
})
export class ContactsearchComponent implements OnInit, OnDestroy {

  emailSearch: string = '';
  contact: ContactInfo;
  $OnDestroy = new Subject();
  hasSearched: boolean = false;
  constructor(private modalCtrl: ModalController, private commonService: CommonService) { }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  search() {
    if(!this.emailSearch) return;
    this.commonService.findContact(this.emailSearch).pipe(takeUntil(this.$OnDestroy)).subscribe((data: ContactInfo) => {
      this.contact = data;
      this.hasSearched = true;
    })
  }

  addContact(contact: ContactInfo) {
    this.commonService.sendFriendRequest(contact.email).pipe(takeUntil(this.$OnDestroy)).subscribe((data: ContactInfo) => {
      this.contact.hasRequested = true;
    });
  }

  getPictureUrl(uid): string {
    return `${environment.BASE_FIREBASE_STORAGE_URL}${uid}%2FprofilePicture%2Fprofile?alt=media`;
  }

  ngOnDestroy(): void {
    this.$OnDestroy.next();
    this.$OnDestroy.complete();
  }
}
