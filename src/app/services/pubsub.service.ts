import { Injectable } from '@angular/core';
import { Socket, io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class PubsubService {

  socket: Socket<any, any>;

  constructor() {

    this.socket = io('http://localhost:3001');

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

    this.socket.on("data", () => { console.log('data arribed') });

    this.socket.on("hello", (arg) => {
      console.log(arg); // world
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



}
