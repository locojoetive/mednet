import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMedTest } from './IMedTest';

@Injectable({
  providedIn: 'root'
})
export class MedTestService {

  constructor(private http: HttpClient) { }

  getMedTest(key: string | null): Observable<IMedTest> {
    return this.http.get<IMedTest>('http://localhost:8080/api/medTest/' + key)
  }
}
