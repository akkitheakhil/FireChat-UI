import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  loading: HTMLIonLoadingElement;
  constructor(private formBuilder: FormBuilder,
    private afsAuth: FirebaseService,
    private router: Router,
    public toastController: ToastController,
    public loadingController: LoadingController) { }
  isPassword: boolean = true;
  registerForm: FormGroup;
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  showHidePassword() {
    this.isPassword = !this.isPassword;
  }

  async register() {
    if(!this.registerForm?.valid) return;
    await this.presentLoading();

    const displayName = this.registerForm?.value?.displayName;
    const email = this.registerForm?.value?.email;
    const password = this.registerForm?.value?.password;
    try {
      const user = await this.afsAuth.register(displayName, email,password);
      user ? this.presentToast('Registration Sucessful. Please login to continue') : this.presentToast('Registration Failed. Please try again');
      console.log('Registered User', user);
    } catch (error) {
      this.presentToast(`Registration Failed. ${error?.message}`);
    }
    this.loading.dismiss();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'ion-loader',
      message: 'Please wait...',
    });

    this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }


}
