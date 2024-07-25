import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonList, IonListHeader, IonCol, IonGrid, IonRow, IonButton } from '@ionic/angular/standalone';
import { DbService } from '../services/db.service';
import { Coordinate } from '../model/Coordinate';

@Component({
  selector: 'app-coordinate-list',
  templateUrl: './coordinate-list.page.html',
  styleUrls: ['./coordinate-list.page.scss'],
  standalone: true,
  imports: [IonButton, IonRow, IonGrid, IonCol, IonListHeader, IonList, IonItem, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CoordinateListPage implements OnInit {

  constructor(private db: DbService) { }

  coordinates: Coordinate[] = [];

  private clientColor: Map<string, string> = new Map<string, string>();

  private iconColorCount: Map<string, number> = new Map<string, number>();

  private idClients: Set<string> = new Set<string>();

  private availableColors: string[] = ['red', 'white', 'blue', 'green', 'yellow', 'purple', 'cyan', 'magenta', 'pink'];

  ngOnInit() {
    this.db.getAll().subscribe(cs => {
      this.coordinates.push(...cs);
      this.idClients = new Set(this.coordinates.map(cs => cs.user));
    });

    this.initializeCss();
  }

  private initializeCss(): void {

    this.initializeIconColor();
    this.assignColorToClient();

  }

  private initializeIconColor() {
    for (let c of this.availableColors) {
      this.iconColorCount.set(c, 0)
    }
  }

  private assignColorToClient(): void {
    for (let c of this.idClients) {
      if (!this.clientColor.has(c)) {
        let luc = this.lessUsedColor();
        this.clientColor.set(c, luc);
        this.iconColorCount.set(luc, this.iconColorCount.get(luc) + 1);
      }
    }
  }

  private lessUsedColor(): string {

    let color: string;
    let arrayVal: number[] = Array.from(this.iconColorCount.values());
    let minor: number = Math.min(...arrayVal);

    this.iconColorCount.forEach((value, key, map) => {
      if (value === minor) {
        color = key;
      }
    })
    return color;
  }


  public getCssClient(user: string): string {

    let color = this.clientColor.get(user);
    return 'color:' + color;
  }


  refresh() {
    this.coordinates.length = 0;
    this.db.getAll().subscribe(cs => this.coordinates.push(...cs));
    this.initializeCss();
  }


}
