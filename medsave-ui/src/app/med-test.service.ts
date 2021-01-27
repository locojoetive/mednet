import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMedTest } from './IMedTest';

@Injectable({
  providedIn: 'root'
})
export class MedTestService {
  url = 'http://localhost:4201/api/medTest/';
  constructor(private http: HttpClient) { }

  getMedTest(key: string): Observable<IMedTest> {
    const headers = new HttpHeaders().set("Bypass-Tunnel-Reminder", "something");
    return this.http.get<IMedTest>(this.url + key, { headers });
  }


  setMedTestAsUsed(medTest: IMedTest) {
    const { key, id, medProductId } = medTest;
    const body = { key, id, medProductId, isUsed: true };
    const headers = new HttpHeaders().set("Bypass-Tunnel-Reminder", "something");
    return this.http.put(this.url, body, { responseType: 'text' , headers });
  }
}


