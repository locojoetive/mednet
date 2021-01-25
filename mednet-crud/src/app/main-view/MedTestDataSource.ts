import { DataSource } from "@angular/cdk/table";
import { Observable } from "rxjs";
import { IMedTest } from "../IMedTest";
import { MedTestService } from "../med-test.service";

export class MedTestDataSource extends DataSource<any> {
    constructor(private assetService: MedTestService) {
      super();
    }
    connect(): Observable<IMedTest[]> {
      const assets = this.assetService.getMedTests();
      return assets;
    }
  
    disconnect() {}
  }