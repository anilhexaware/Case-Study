import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  //Method for create data
  saveEmployee(data: any) {
    return this.http.post<any>(
      environment.apiUrl + 'ATMDevPortal/htd/save',
      data
    );
  }

  //Method for api details given
  fetchDetails(data: any) {
    return this.http.post<any>(
      environment.apiUrl + 'ATMDevPortal/htd/details',
      data
    );
  }

  //Method for update the data
  postUpdate(data: any) {
    return this.http.post<any>(
      environment.apiUrl + 'ATMDevPortal/htd/update',
      data
    );
  }

  //Method for roles call
  getJson() {
    return this.http.get(`assets/bd.json`);
  }
}
