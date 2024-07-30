import { Injectable } from '@angular/core';
import { Socket, io } from "socket.io-client";
import { Coordinate } from '../model/Coordinate';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { User } from '../model/User';
import { BehaviorSubject, Observable } from 'rxjs';
import { CoordinateEvent } from '../model/CoordinateEvent';
import { StatsService } from './stats.service';

@Injectable({
  providedIn: 'root'
})
export class PubsubService {

  socket: Socket<any, any>;

  private idClients: Set<string> = new Set<string>();

  private urlresourceserver: string = environment.resourceserver;

  private ncoordsaverage: number = environment.ncoordsaverage;

  private coordevent: BehaviorSubject<CoordinateEvent> = new BehaviorSubject(null);

  constructor(private authService: AuthService, private stats: StatsService) {

    this.socket = io(this.urlresourceserver);

    this.socket.on("connect", () => {
      console.log('socket id ' + this.socket.id);
      console.log('socket connected ' + this.socket.connected);
      const engine = this.socket.io.engine;
      console.log('socket trasnsport ' + engine.transport.name);
    });

    this.socket.on("disconnect", (reason) => {

      console.log('socket id ' + this.socket.id);
      console.log('socket connected ' + this.socket.connected);

      if (this.socket.active) {
        // temporary disconnection, the socket will automatically try to reconnect
      } else {
        // the connection was forcefully closed by the server or the client itself
        // in that case, `socket.connect()` must be manually called in order to reconnect
        console.log(reason);
      }
    });

    this.socket.on('newclientconnected', (arg: any) => {
      console.log('new client connected:' + arg);
    });

    this.socket.on('coordinateall', (c: Coordinate) => {
      console.log('receiving coordinates from server included me: ' + JSON.stringify(c));
    });

    this.socket.on('coordinateallwithoutme', (c: CoordinateEvent) => {
      console.log('receiving coordinates from server whitout me: ' + JSON.stringify(c));
      this.stats.addCoordinates(c, this.ncoordsaverage);
      let newClient = false;
      let originals = this.idClients.size;
      this.idClients.add(c.user);
      let currents = this.idClients.size;
      if (originals < currents) {
        newClient = true;
      }
      c.newUser = newClient;
      this.setCoordinateEvent(c);
    });


    this.socket.on("connect_error", (error) => {
      if (this.socket.active) {
        // temporary failure, the socket will automatically try to reconnect
      } else {
        // the connection was denied by the server
        // in that case, `socket.connect()` must be manually called in order to reconnect
        console.log(error.message);
      }
    });
  }

  connectionTest(text: string): void {

    this.socket.emit("hallo", text, (response: any) => {
      console.log(response);
    });

  }

  sendCoordinate(coordinate: Coordinate): void {
    //let user: User = this.authService.getUser();
    //coordinate.user = user.name;
    this.socket.emit("coordinate", coordinate, (response: any) => {
      console.log(response);
    });

  }

  getCoordinateEvent(): Observable<CoordinateEvent> {
    return this.coordevent.asObservable();
  }

  setCoordinateEvent(event: CoordinateEvent) {
    this.coordevent.next(event);
  }

  getIdClients(): Set<string> {
    return this.idClients;
  }

}
