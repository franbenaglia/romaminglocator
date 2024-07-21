import { Injectable } from '@angular/core';
import { repeat, defer, of, Observable, delay } from 'rxjs';
import { Coordinate } from '../model/Coordinate';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EventCoordService {

  constructor() {

  }


  getCoordsMockEvent(lat?: number, ln?: number, gap?: number): Observable<Coordinate> {

    let latitude: number = lat ? lat : 34;
    let longitude: number = ln ? ln : -57;
    let skip: number = gap ? gap : 0.5;
    let diff: number = 0;

    let sourceCoords = defer(() => {

      let c: Coordinate = new Coordinate();

      c.lat = latitude + diff;
      c.lng = longitude + diff;
      c.time = new Date();
      c.group = 'room1';
      c.user = 'user1';

      diff = diff + skip;
      if (diff > 2) diff = 0;

      return of(c);
    });

    return sourceCoords.pipe(repeat({ delay: environment.period }));//.pipe(delay(7000));
  }









}
