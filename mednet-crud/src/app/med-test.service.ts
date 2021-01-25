import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/'
import { HttpClient, HttpParams } from '@angular/common/http'
import { IMedTest } from './IMedTest';

@Injectable()
export class MedTestService {
  public assets: any = [];

  constructor(private http: HttpClient) {}

  getMedTests(): Observable<IMedTest[]> {
    return this.http.get<IMedTest[]>('http://localhost:8080/api/assets');
  }

  getMedTest(id: string): Observable<IMedTest> {
    let params = new HttpParams().set('id', id);
    return this.http.get<IMedTest>('http://localhost:8080/api/assets/', {params})
  }

  createMedTest(medTest: IMedTest): Observable<IMedTest> {
    const {id, medProductId} = medTest.record;
    let params = new HttpParams();
    params.append('id', id);
    params.append('medProductId', medProductId);
    return this.http.post<IMedTest>('http://localhost:8080/api/assets/', {params})
  }

  updateMedTest(medTest: IMedTest): Observable<boolean> {
    const {id, medProductId, isUsed, docType} = medTest.record;

    let params = new HttpParams();
    params.append('id', id);
    params.append('medProductId', medProductId);
    params.append('isUsed', isUsed ? 'true' : 'false');
    params.append('docType', docType);
    
    return this.http.put<boolean>('http://localhost:8080/api/assets/', {params})
  }

  deleteMedTest(id: string){
    let params = new HttpParams().set('id', id);
    return this.http.delete('http://localhost:8080/api/assets/', {params})
  }
}