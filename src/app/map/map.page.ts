import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonSpinner, IonPopover, IonInput, IonToast } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { Platform } from '../model/Platform';
import { Coordinate } from '../model/Coordinate';
import { GpslocatorService } from '../services/gpslocator.service';
import { EventCoordService } from '../services/event-coord.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonToast, IonInput, IonPopover, IonSpinner, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MapPage implements OnInit {

  constructor(private geolocService: GpslocatorService, private coordMockService: EventCoordService) { }

  platform: Platform;
  positioncoords: string = '';

  ngOnInit() {
    //this.checkPermissions();
    this.position();
  }

  leafletMap: any;

  private lat: number;

  private lng: number;

  private zoom: number = 16;

  spin: boolean = true;

  coordinate: Coordinate;

  private iconMark = L.icon({
    iconUrl: 'assets/icon/marker.png',
    iconSize: [30, 40]
  });

  private iconCurrentPosition = L.icon({
    iconUrl: 'assets/icon/redmark.png',
    iconSize: [40, 50]
  });

  private position(): void {

    this.geolocService.getCurrentPosition().subscribe(position => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.loadLeafletMap();
      //this.mockPosition(this.lat, this.lng, 0.05);
    });
  }

  private mockPosition(lat?: number, ln?: number, gap?: number): void {

    this.coordMockService.getCoordsMockEvent(lat, ln, gap).subscribe(position => {
      this.lat = position.lat;
      this.lng = position.lng;
      this.currentMarkerPosition();
      //this.leafletMap.setView([this.lat, this.lng], this.zoom);
    });
  }

  private loadLeafletMap(): void {

    this.spin = true;

    this.leafletMap = new L.Map('leafletMap');

    const self = this;

    this.leafletMap.on('load', function () {

      setTimeout(() => {

        self.leafletMap.invalidateSize();
        self.spin = false;

      }, 100);

    });

    this.leafletMap.setView([this.lat, this.lng], this.zoom);

    this.configMap();

    this.currentMarkerPosition();

    this.handlers();

  }


  private currentMarkerPosition(): void {

    let marker = L.marker([this.lat, this.lng], { icon: this.iconCurrentPosition }).addTo(this.leafletMap)
    let coordinate: Coordinate = new Coordinate();
    coordinate.lat = this.lat;
    coordinate.lng = this.lng;
    marker.addEventListener('click', () => {
      this.coordinate = coordinate;
    });
  }

  private handlers(): void {

    const self = this;

    function onMapDoubleClick(e) {
      let mark = L.marker([e.latlng.lat, e.latlng.lng], { icon: self.iconMark }).addTo(self.leafletMap);
      let coordinate: Coordinate = new Coordinate();
      coordinate.lat = e.latlng.lat;
      coordinate.lng = e.latlng.lng;
      mark.addEventListener('click', () => {
        self.coordinate = coordinate;
      });
    }

    this.leafletMap.on('dblclick', onMapDoubleClick);

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

    let layerControl = L.control.layers(baseMaps).addTo(this.leafletMap);

    //baseMaps.Topography.addTo(this.leafletMap);

  }

  private checkPermissions(): void {

    this.geolocService.checkPermissions().subscribe(status => {
      console.log(status);
      if (status !== 'web' && (status.location !== 'granted' || status.coarseLocation !== 'granted')) {

      }
    });

  }

}


