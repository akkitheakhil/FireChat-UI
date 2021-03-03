import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetstartedPageRoutingModule } from './getstarted-routing.module';

import { GetstartedPage } from './getstarted.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetstartedPageRoutingModule
  ],
  declarations: [GetstartedPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GetstartedPageModule {}
