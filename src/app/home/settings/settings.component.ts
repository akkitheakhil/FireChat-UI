import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  constructor(private afAuth: FirebaseService, private router: Router, public alertController: AlertController) { }

  ngOnInit() { }

  async logout() {
    try {
      const res = await this.afAuth.logout();
      if(res) this.router.navigate(['getstarted']);
    } catch (error) {
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'ion-alert',
      header: 'Confirm!',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    await alert.present();
  }

}
