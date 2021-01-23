import { DataSource } from '@angular/cdk/collections';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetService } from './asset.service';
import { IAsset } from './IAsset';


@Component({
  selector: 'table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input('assets')
  assets: Observable<IAsset[]> = new Observable<IAsset[]>();
  
  dataSource = new AssetDataSource(this.assetService);
  displayedColumns = [
    'key', 
    'id',
    'color',
    'size',
    'owner',
    'appraisedValue',
    'docType',
    'modify', 
    'delete'
  ];
  
  constructor(
    private assetService: AssetService
  ) { }

  getAllAssets() {
    this.assets = this.assetService.getAllAssets();
  }
}

export class AssetDataSource extends DataSource<any> {
  constructor(private assetService: AssetService) {
    super();
  }
  connect(): Observable<IAsset[]> {
    return this.assetService.getAllAssets();
  }

  disconnect() {}
}