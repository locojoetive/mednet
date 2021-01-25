import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { IMedTest } from './IMedTest';

@Injectable()
export class MedTestService {
  public assets: any = [];

  constructor(private http: HttpClient) {}

  getMedTests(): Observable<IMedTest[]> {
    return this.http.get<IMedTest[]>('http://localhost:8080/api/medTest');
  }

  getMedTest(id: string): Observable<IMedTest> {
    let params = new HttpParams().set('id', id);
    return this.http.get<IMedTest>('http://localhost:8080/api/medTest/', {params})
  }

  createMedTest(medTest: IMedTest) {
    const {id, medProductId} = medTest.record;
    const body = { id, medProductId };
    const result = this.http.post('http://localhost:8080/api/medTest/', body ,{responseType: 'text'}).subscribe({
      next: data => {
          console.log("CREATE successful: " + data);
      },
      error: error => {
          console.log('CREATE failed: ', error);
      }
    });
  }

  updateMedTest(medTest: IMedTest) {
    const {id, medProductId, isUsed} = medTest.record;
    const key = medTest.key;
    const body = { key, id, medProductId, isUsed };
    this.http.put('http://localhost:8080/api/medTest/', body ,{responseType: 'text'}).subscribe({
      next: data => {
          console.log("UPDATE successful: " + data);
      },
      error: error => {
          console.log('UPDATE failed: ', error);
      }
    });
  }

  deleteMedTest(key: string) {
    this.http.delete('http://localhost:8080/api/medTest/' + key, {responseType: 'text'}).subscribe({
      next: data => {
          console.log("DELETE successful: " + data);
      },
      error: error => {
          console.log('DELETE failed: ', error);
      }
    });
  }
}