import { Injectable } from '@angular/core';
import { Coordinate } from '../model/Coordinate';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor() { }

  private coordinates: Map<string, Array<Coordinate>> = new Map<string, Array<Coordinate>>;

  private avcoordinates: Array<Coordinate> = [];

  //push coordinates all users, max n for user
  addCoordinates(c: Coordinate, n: number): void {
    let cs: Array<Coordinate>;
    if (this.coordinates.has(c.user)) {
      cs = this.coordinates.get(c.user);
      cs.push(c);
      if (cs.length > n) {
        cs.shift();
      }

    } else {
      this.coordinates.set(c.user, [c]);
    }

  }

  //group of coords to average
  private groupCoordinates(): void {
    this.avcoordinates.length = 0;
    this.coordinates.forEach(c => {
      this.avcoordinates.push(...c);
    });

  }

  //all coordinates n for client
  mapCenter(): Coordinate {

    this.groupCoordinates();
    let c = new Coordinate();
    let size = this.avcoordinates.length;
    let sumlats: number = 0;
    let sumlns: number = 0;

    for (let cs of this.avcoordinates) {
      sumlats = sumlats + cs.lat;
      sumlns = sumlns + cs.ln;
    }

    c.lat = sumlats / size;
    c.ln = sumlns / size;

    return c;

  }

}
