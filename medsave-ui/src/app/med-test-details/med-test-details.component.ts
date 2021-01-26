import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IMedTest } from '../IMedTest';
import { MedTestService } from '../med-test.service';

@Component({
  selector: 'med-test-details',
  templateUrl: './med-test-details.component.html',
  styleUrls: ['./med-test-details.component.scss']
})
export class MedTestDetailsComponent {
  medTest: IMedTest | null = null;
  key = "";
  showLoading = false;
  isUpdating = false;
  isUpdated = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medTestService: MedTestService
  ) { }

  ngOnInit() {
    this.fetchMedTest();
  }

  fetchMedTest() {
    this.medTest = null;
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const key = params.get('id');
        this.showLoading = true;
        setTimeout(() => {
          this.showLoading = false;
        }, 20000)
        if (key) {
          this.key = key;
          console.log("Requesting " + key);
          return this.medTestService.getMedTest(key);
        } else {
          console.log("NO KEY SPECIFIED!!!")
          return new Observable<any>();
        }
      })
    ).subscribe(data => {
      console.log("incoming data...", data);
      this.medTest = data;
      if (this.medTest)
        this.medTest.key = this.key;
      console.log(this.medTest);
      this.showLoading = false;
    });
  }

  updateTest() {
    if (this.medTest != null) {
      console.log("Start updating....");
      this.isUpdating = true;
      this.medTestService.setMedTestAsUsed(this.medTest).subscribe({
        next: data => {
          console.log("UPDATE successful: " + data);
          this.isUpdating = false;
          this.updated = true;
        },
        error: error => {
          console.log('UPDATE failed: ', error);
          this.isUpdating = false;
        }
      });
    }
  }
}
