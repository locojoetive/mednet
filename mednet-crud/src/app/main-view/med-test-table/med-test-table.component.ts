import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMedTest } from 'src/app/IMedTest';
import { MedTestService } from 'src/app/med-test.service';


@Component({
  selector: 'med-test-table',
  templateUrl: './med-test-table.component.html',
  styleUrls: ['./med-test-table.component.scss'],
})
export class MedTestTableComponent {
  @Input('dataSource') dataSource: any;
  @Output() voted = new EventEmitter<IMedTest>();

  displayedColumns = [
    'key', 
    'id',
    'medProductId',
    'isUsed',
    'docType',
    'modify', 
    'delete'
  ];

  constructor(
    private medTestService: MedTestService
  ) {}
  
  onUpdate(voted: IMedTest) {
    this.voted.emit(voted);
  }

  onDelete(voted: IMedTest) {
    this.medTestService.deleteMedTest(voted.record.id);
  }
}
