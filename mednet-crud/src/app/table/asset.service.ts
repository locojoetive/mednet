import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/'
import { HttpClient } from '@angular/common/http'
import { IAsset } from './IAsset';

@Injectable()
export class AssetService {
  public assets: any = [];

  constructor(private http: HttpClient) {}

  getAllAssets(): Observable<IAsset[]> {
    return this.http.get<IAsset[]>('http://localhost:8080/api/assets');;
  }

  getAsset(key: string): Observable<IAsset> {
    return this.http.get<IAsset>('http://localhost:8080/api/assets/' + key)
  }

  insertAsset(asset: IAsset): Observable<IAsset> {
    return this.http.post<IAsset>('http://localhost:8080/api/assets/', asset)
  }

  updateAsset(asset: IAsset): Observable<void> {
    return this.http.put<void>(
      'http://localhost:8000/api/Assets/' + asset.key,
      asset
    )
  }

  deleteAsset(key: string) {
    return this.http.delete('http://localhost:8000/api/Assets/' + key)
  }
}