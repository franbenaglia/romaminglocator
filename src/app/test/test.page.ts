import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonInput, IonButton } from '@ionic/angular/standalone';
import { PubsubService } from '../services/pubsub.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonCol, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TestPage implements OnInit {

  constructor(private pubsub: PubsubService) { }

  text: string;

  ngOnInit() {
  }

  send() {
    this.pubsub.connectionTest(this.text);
  }

}
