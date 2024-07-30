import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Coordinate } from '../model/Coordinate';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private http: HttpClient) { }

  urlresourceserver: string = environment.resourceserver;

  baseURL: string = this.urlresourceserver + "/coordinates/";

  getAll(): Observable<Coordinate[]> {
    return this.http.get<Coordinate[]>(this.baseURL + 'all');
  }

  deleteAll(): Observable<any> {
    return this.http.delete<any>(this.baseURL + 'deleteAll');
  }

  getByUser(user: string): Observable<Coordinate[]> {
    return this.http.get<Coordinate[]>(this.baseURL + 'byuser/' + user);
  }

}
