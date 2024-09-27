import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSelectOption, IonSelect, IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonList, IonRow, IonButton, IonGrid, IonCol } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { PubsubService } from '../services/pubsub.service';

type UserRoom = {
  name: string;
  room: String;
};


@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
  standalone: true,
  imports: [IonSelectOption, IonSelect, IonCol, IonGrid, IonButton, IonRow, IonList, IonItem, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RoomPage implements OnInit {

  constructor(private auth: AuthService, private ps: PubsubService) { }

  rooms: Set<UserRoom> = new Set<UserRoom>();
  room: string;

  setRoom(ds: any) {
    this.room = ds.detail.value;
    this.auth.getUser().room = this.room;
    this.setUsers();
  }

  ngOnInit() {
    this.setUsers();
  }

  private setUsers(): void {

    this.rooms.clear();
    this.ps.getIdClients().forEach(user =>
      this.rooms.add({ name: user, room: 'room1' })
    )
    this.rooms.add({ name: this.auth.getUser().name, room: this.auth.getUser().room ? this.auth.getUser().room : 'room1' });

  }

}

