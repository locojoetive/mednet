import { Component, Input, OnChanges, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { IMedTest } from 'src/app/IMedTest';
import { MedTestService } from 'src/app/med-test.service';
import { FormMode } from './FormMode';

@Component({
  selector: 'med-test-form',
  templateUrl: './med-test-form.component.html',
  styleUrls: ['./med-test-form.component.scss']
})
export class MedTestFormComponent implements OnChanges {
  @Input('formMode') formMode: FormMode = FormMode.CREATE;
  @Input('voted') voted!: IMedTest | null;
  @Output() closeForm = new EventEmitter<boolean>();

  createForm = this.fb.group({
    medTestId: ['', Validators.required],
    medProductId: ['', Validators.required]
  });

  updateForm = this.fb.group({
    medTestId: ['', Validators.required],
    medProductId: ['', Validators.required],
    isUsed: ['']
  });

  constructor(
    private fb: FormBuilder,
    private medTestService: MedTestService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.voted.currentValue != null) {
      const toUpdate = changes.voted.currentValue.record;
      this.updateForm.setValue({
        medTestId: toUpdate.id,
        medProductId: toUpdate.medProductId,
        isUsed: toUpdate.isUsed
      });
    }
  }

  onCreate() {
    const {medTestId, medProductId } = this.createForm.value;
    const key = medProductId + "-" + medTestId;
    const id = medTestId;
    const medTest = {
      key,
      record: {
        id,
        medProductId,
        isUsed: false,
        docType: "medTest"
      }
    }
    this.medTestService.createMedTest(medTest);
    this.closeForm.emit(true);
  }
  
  onUpdate() {
    if (this.voted != null) {
      const {medTestId, medProductId, isUsed } = this.updateForm.value;
      const key = this.voted.key;
      const id = medTestId;
      const medTest = {
        key,
        record: {
          id,
          medProductId,
          isUsed,
          docType: "medTest"
        }
      }
      this.medTestService.updateMedTest(medTest);
    }
    this.closeForm.emit(true);
  }
}
