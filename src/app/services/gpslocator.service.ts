import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Observable, from, of } from 'rxjs';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GpslocatorService {

  constructor(private platform: Platform) {
  }

  getRoamingPosition(): Observable<any> {
    if (!Capacitor.isNativePlatform()) {
      return from(this.getRoamingNavigatorPosition());
    } else {
      return this.getRoamingNativePosition();
    }
  }


  private getRoamingNativePosition(): Observable<any> {
    return from(this.watchCurrentPositionNative());
  }


  public getCurrentStaticPosition(): Observable<any> {

    if (!Capacitor.isNativePlatform()) {
      return from(this.getStaticPositionFromNavigator());
    } else {
      return from(this.staticPositionNative());
    }
  }

  private staticPositionNative = async () => {
    return await Geolocation.getCurrentPosition();
  };

  private getStaticPositionFromNavigator = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  private getRoamingNavigatorPosition = () => {
    return new Promise((res, rej) => {
      navigator.geolocation.watchPosition(res, rej);
    });
  }

  private watchCurrentPositionNative2 = async () => {
    return await Geolocation.watchPosition({}, (position: Position) => {
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
      console.log(position.coords.speed);
      console.log(position.coords.altitude);
      console.log(position.timestamp);
    });

  }

  private watchCurrentPositionNative = () => {
    return new Promise((res, rej) => {
      Geolocation.watchPosition({}, res);
    });
  }

  public checkPermissions(): Observable<any> {

    if (this.platform.is('hybrid')) {
      return from(Geolocation.checkPermissions());
    } else {
      return of('web');
    }

  }

}
