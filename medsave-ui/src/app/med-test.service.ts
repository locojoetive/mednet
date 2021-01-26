import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMedTest } from './IMedTest';

@Injectable({
  providedIn: 'root'
})
export class MedTestService {
  url = 'http://8cb54631e7a8.ngrok.io/api/medTest/';
  constructor(private http: HttpClient) { }

  getMedTest(key: string): Observable<IMedTest> {
    return this.http.get<IMedTest>(this.url + key);
  }
}
