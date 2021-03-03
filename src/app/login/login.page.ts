import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isPassword: boolean = true;
  loading: HTMLIonLoadingElement;
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private afsAuth: FirebaseService,
    private router: Router,
    public toastController: ToastController,
    public loadingController: LoadingController) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  showHidePassword() {
    this.isPassword = !this.isPassword;
  }

  async login() {
    if (!this.loginForm?.valid) return;
    this.presentLoading();

    const email = this.loginForm?.value?.email;
    const password = this.loginForm?.value?.password;

    try {
      const user = await this.afsAuth.login(email,password);
      user ? this.router.navigate(['home']) : this.presentToast('Login Failed. Please try again');
    } catch (error) {
      this.presentToast(`Login Failed. ${error?.message}`);
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
