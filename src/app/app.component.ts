import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonMenuButton, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonHeader, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { paperPlaneOutline, paperPlaneSharp } from 'ionicons/icons';
import { User } from './model/User';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonMenuButton, IonButtons, IonHeader, RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent {
  public appPages = [
    { title: 'Map', url: '/folder/map', icon: 'paper-plane' },
    { title: 'Coordinates', url: 'folder/coordinate-list', icon: 'paper-plane' },
    { title: 'Room-Users', url: 'folder/room', icon: 'paper-plane' },
    { title: 'Logout', url: 'folder/logout', icon: 'paper-plane' },

  ];
  constructor(private cookieService: CookieService, private authService: AuthService, private router: Router, private zone: NgZone) {
    addIcons({ paperPlaneOutline, paperPlaneSharp });
  }

  user: User = new User();

  showMenu: boolean = true;

  ngOnInit() {

    if (!Capacitor.isNativePlatform()) {

      let token: string = this.cookieService.get('token');
      let userName: string = this.cookieService.get('username');


      if (token) {
        this.authService.setLogin(true)
        this.authService.setUser(userName, token);
        this.user.name = userName;
        this.user.token = token;
      }

      if (!this.authService.isLoggedIn()) {
        this.showMenu = false;
        this.router.navigate((['login']));
      } else {
        this.showMenu = true;
      }
    } else {
      this.initializeApp();
    }

    if (!this.authService.isLoggedIn()) {
      this.showMenu = false;
      this.router.navigate((['login']));
    } else {
      this.showMenu = true;
    }

  }


  initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        const url = event.url;
        const ext = url.split(".app/").pop();
        const us = url.split(".user/").pop();
        const user = us.split('.').shift();

        if (ext) {
          console.log('token as url ' + ext);
          this.authService.setLogin(true)
          this.authService.setUser(user, ext);
          this.user.name = user;
          this.user.token = ext;
          this.showMenu = true;
          this.router.navigate((['folder/landingpage']));
        }

      });
    });
  }


}
