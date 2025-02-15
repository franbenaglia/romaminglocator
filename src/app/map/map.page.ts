import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonSpinner, IonPopover, IonInput, IonToast, IonFab, IonFabButton, IonIcon, IonToggle } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { Coordinate } from '../model/Coordinate';
import { GpslocatorService } from '../services/gpslocator.service';
import { EventCoordService } from '../services/event-coord.service';
import { PubsubService } from '../services/pubsub.service';
import { AuthService } from '../services/auth.service';
import { StatsService } from '../services/stats.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { addIcons } from 'ionicons';
import { add, toggle, cut, trashOutline } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonToggle, IonIcon, IonFabButton, IonFab, IonToast, IonInput, IonPopover, IonSpinner, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MapPage implements OnInit, OnDestroy {

  constructor(private stats: StatsService, private auth: AuthService, private pubsub: PubsubService, private geolocService: GpslocatorService, private coordMockService: EventCoordService) {
    addIcons({ add, toggle, cut, trashOutline });
  }

  private clientColor: Map<string, string> = new Map<string, string>();

  private iconColorCount: Map<string, number> = new Map<string, number>();

  private availableColors: string[] = ['red', 'black', 'blue'];

  private ncoordsaverage: number = environment.ncoordsaverage

  private enableCenter: boolean = true;

  private layerGroup = L.layerGroup();

  private save: boolean = false;

  subscriptionGeo: Subscription;
  susbcriptionMock: Subscription;
  subscriptionCEvent: Subscription;
  subscriptionGeoCheck: Subscription;

  ngOnInit() {

    this.initializeIconColor();
    //this.checkPermissions();
    this.position();
  }

  private initializeIconColor() {
    for (let c of this.availableColors) {
      this.iconColorCount.set(c, 0)
    }
  }

  leafletMap: any;

  private lat: number;

  private lng: number;

  private zoom: number = 16;

  spin: boolean = true;

  coordinate: Coordinate;

  private position(): void {
    //test on device
    //this.subscriptionGeo = this.geolocService.getRoamingPosition().subscribe(position => {
    this.subscriptionGeo = this.geolocService.getCurrentStaticPosition().subscribe(position => {

      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;

      this.assignColorToLocalClient();

      this.loadLeafletMap();

      //if (!Capacitor.isNativePlatform()) {
        this.mockPosition(this.lat, this.lng, 0.005);
      //} else {
      //  this.currentMarkerPosition(this.auth.getUser().name);
      //}

      this.clientsPositions();

    });
  }

  private mockPosition(lat?: number, ln?: number, _gap?: number): void {
    let gap: number = this.coordMockService.getGap(0.005, 0.0005);
    let c: Coordinate = this.coordMockService.getRandomCoords(lat, ln, 0.005, 0.0005); // c.lat, c.ln
    this.susbcriptionMock = this.coordMockService.getCoordsMockEvent(c.lat, c.ln, gap).subscribe(position => {
      this.lat = position.lat;
      this.lng = position.ln;
      let co: Coordinate = Coordinate.coordinateBuilder(position.lat, position.ln, position.time, this.auth.getUser().name, this.auth.getRoom());
      this.stats.addCoordinates(co, this.ncoordsaverage);
      this.currentMarkerPosition(this.auth.getUser().name);
      co.save = this.save;
      this.pubsub.sendCoordinate(co);
    });
  }

  toggleCenter() {
    this.enableCenter = !this.enableCenter;
  }

  enableSave() {
    this.save = !this.save;
  }

  private loadLeafletMap(): void {

    this.spin = true;

    this.leafletMap = new L.Map('leafletMap');

    this.layerGroup.addTo(this.leafletMap);

    const self = this;

    this.leafletMap.on('load', function () {

      setTimeout(() => {

        self.leafletMap.invalidateSize();
        self.spin = false;

      }, 100);

    });

    this.leafletMap.setView([this.lat, this.lng], this.zoom);

    this.configMap();

    //TODO VERSION DE PRUEBA CON DISP REAL SE DEBE DESCOMENTAR LAS 2 LINEAS y VER COMO ACTUALIZAR CAMBIOS DE POSICION
    //this.pubsub.sendCoordinate(Coordinate.coordinateBuilder(position.lat, position.ln, position.time, this.auth.getUser().name, position.group));
    //this.currentMarkerPosition(this.auth.getUser().name);

  }

  private currentMarkerPosition(user: string): void {

    L.marker([this.lat, this.lng], { icon: this.iconCurrentPosition(user) }).addTo(this.layerGroup); //this.leafletMap
    if (this.enableCenter) {
      let center: Coordinate = this.stats.mapCenter();
      this.leafletMap.setView([center.lat, center.ln], this.zoom);
    }

  }


  private configMap(): void {

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

      attribution: '&copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

    }).addTo(this.leafletMap);

    let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    });

    let osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
    });

    let baseMaps = {
      'OpenStreetMap': osm,
      'OpenStreetMap.HOT': osmHOT,
      Topography: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'TOPO-WMS'
      }),

      Places: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'OSM-Overlay-WMS'
      }),

      'Topography, then places': L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'TOPO-WMS,OSM-Overlay-WMS'
      }),

      'Places, then topography': L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'OSM-Overlay-WMS,TOPO-WMS'
      })
    };

    L.control.layers(baseMaps).addTo(this.leafletMap);

  }

  private clientsPositions(): void {

    this.subscriptionCEvent = this.pubsub.getCoordinateEvent().subscribe(c => {
      if (c) {
        this.lat = c.lat;
        this.lng = c.ln;
        if (c.newUser) {
          this.assignColorToClient();
        }
        this.currentMarkerPosition(c.user);
      }
    });

  }

  private iconCurrentPosition = (user: string) => {
    return L.icon({
      iconUrl: this.getIconUrl(user) ? this.getIconUrl(user) : 'black',
      iconSize: [40, 50]
    });
  }

  private getIconUrl(user: string): string {

    let color = this.clientColor.get(user);
    return 'assets/icon/' + color + '.png';
  }

  private assignColorToLocalClient(): void {
    this.clientColor.set(this.auth.getUser().name, 'red');
  }

  private assignColorToClient(): void {
    for (let c of this.pubsub.getIdClients()) {  //TODO WATCH IF getIdClients COULD BE PROBLEMATIC, PERHAPS MUST BE IN THE COORDEVENT
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

  private checkPermissions(): void {

    this.subscriptionGeoCheck = this.geolocService.checkPermissions().subscribe(status => {
      console.log(status);
      if (status !== 'web' && (status.location !== 'granted' || status.coarseLocation !== 'granted')) {

      }
    });

  }

  clearMarks() {
    this.layerGroup.clearLayers();
  }

  ngOnDestroy(): void {
    if (this.subscriptionGeo) {
      this.subscriptionGeo.unsubscribe();
    }
    if (this.susbcriptionMock) {
      this.susbcriptionMock.unsubscribe();
    }
    if (this.subscriptionCEvent) {
      this.subscriptionCEvent.unsubscribe();
    }
    if (this.subscriptionGeoCheck) {
      this.subscriptionGeoCheck.unsubscribe();
    }
  }

}


