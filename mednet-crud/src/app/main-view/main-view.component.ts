import { Component } from '@angular/core';
import { IMedTest } from '../IMedTest';
import { MedTestService } from '../med-test.service';
import { MedTest } from '../MedTest';
import { FormMode } from './med-test-form/FormMode';
import { MedTestDataSource } from './MedTestDataSource';

@Component({
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent {
  formMode: FormMode = FormMode.CREATE;
  dataSource : MedTestDataSource;
  showForm = false;
  
  votedForUpdate!: MedTest | null;

  constructor(
    private assetService: MedTestService
  ) { 
    this.dataSource = new MedTestDataSource(this.assetService);
  }


  onRefresh() {
    this.dataSource = new MedTestDataSource(this.assetService);
  }

  onShowCreateForm() {
    this.showForm = !this.showForm;
    this.votedForUpdate = null;
  }

  onShowUpdateForm(voted: IMedTest) {
    this.showForm = true;
    this.votedForUpdate = new MedTest(voted);
  }

  onCloseForm() {
    this.showForm = false;
  }
}
