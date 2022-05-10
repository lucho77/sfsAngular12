import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: any;

  constructor( private http: HttpClient) { }

  public loadConfig() {
    return this.http.get('./assets/configuration.json')
      .toPromise()
      .then((config: any) => {
        this.config = config;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  getConfig() {
    return  this.config;
  }
}