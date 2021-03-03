import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { DateagoPipe } from '../utlis/dateago.pipe';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MessengerComponent } from '../components/messenger/messenger.component';
import { ContactsearchComponent } from '../components/contactsearch/contactsearch.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [HomePage, DashboardComponent, ContactsComponent, ProfileComponent, DateagoPipe, MessengerComponent, ContactsearchComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
