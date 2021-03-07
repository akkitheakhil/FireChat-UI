import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ContactsearchComponent } from 'src/app/components/contactsearch/contactsearch.component';
import { MessengerComponent } from 'src/app/components/messenger/messenger.component';
import { Contact, ContactsData } from 'src/app/models/contacts.model';
import { CommonService } from 'src/app/services/common.service';
import { DataFactoryService } from 'src/app/services/data-factory.service';
import { environment } from 'src/environments/environment';
import { debounceTime } from 'rxjs/operators';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit, AfterViewChecked {

  $OnDestroy = new Subject();
  contacts: Contact[] = [];
  isLoading: boolean = true;
  isLoadingContent = [...Array(4).keys()];
  favs: Contact[] = [];
  searchKeyWord: string;
  contactsResult: Contact[] = [];
  isSearchingFormControl:FormControl = new FormControl();
  constructor(public modalController: ModalController,
    private commonService: CommonService,
     private dataFactory: DataFactoryService,
     private firebase: FirebaseService) { }

  ngOnInit() {
    this.getAllContacts();
    this.searchFile();
    console.log(this.isLoadingContent);
  }

  ngAfterViewChecked(): void {
    this.setNotificationRead();
  }

  setNotificationRead() {
    setTimeout(() => {
      this.commonService.notificationService.next({ key: 'contact', val: false });
    }, 300);
  }

  getAllContacts() {
    this.isLoading = true;
    this.commonService.getAllContacts().pipe(takeUntil(this.$OnDestroy)).subscribe((data: ContactsData) => {
      this.contacts = data?.contacts;
      this.contactsResult = data?.contacts;
      this.getFavourites();
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.firebase.checkAuthState();
    })
  }

  getFavourites() {
    const favItems: string[] = this.dataFactory.retriveFavContacts || [];
    if (!favItems || favItems.length <=0 ) return;
    this.contacts.forEach(item => {
      if (favItems.includes(item.uid)) {
        this.favs.push(item);
      }
    });
  }

  async openMessage(contact: Contact) {
    const modal = await this.modalController.create({
      component: MessengerComponent,
      cssClass: 'custom-ion-modal',
      componentProps: {
        'uid': contact.uid,
        'displayName': contact.displayName,
        'email': contact.email
      }
    });
    return await modal.present();
  }

  async openContactSearch() {
    const modal = await this.modalController.create({
      component: ContactsearchComponent,
      cssClass: 'custom-ion-modal',
      componentProps: {
        'uid': 'Douglas',
        'displayName': 'Adams',
        'email': 'N'
      }
    });
    return await modal.present();
  }

  filter() {
    console.log('searching..')
    if (this.searchKeyWord) {
      this.contactsResult = [];
      this.contactsResult = this.contacts.filter(x => {
        x.displayName.toLocaleLowerCase().includes(this.searchKeyWord.toLocaleLowerCase()) ||
          x.email.toLocaleLowerCase().includes(this.searchKeyWord.toLocaleLowerCase());
      })
    } else {
      this.contactsResult = [];
      this.contactsResult = this.contacts;
    }
  }

  searchFile() {
    this.isSearchingFormControl.valueChanges.pipe(debounceTime(300),takeUntil(this.$OnDestroy)).subscribe((data) => {
      if (data) {
        this.contactsResult = [];
        this.contactsResult = this.contacts.filter(x =>
          x.displayName.toLocaleLowerCase().includes(data.toLocaleLowerCase()) ||
          x.email.toLocaleLowerCase().includes(data.toLocaleLowerCase())
        )
      } else {
        this.contactsResult = [];
        this.contactsResult.push(...this.contacts);
      }
    })
  }

  ngOnDestroy(): void {
    this.$OnDestroy.next();
    this.$OnDestroy.complete();
  }

  getPictureUrl(uid): string {
    return `${environment.BASE_FIREBASE_STORAGE_URL}${uid}%2FprofilePicture%2Fprofile?alt=media`;
  }

}
