import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IMedTest } from '../IMedTest';
import { MedTestService } from '../med-test.service';

import { Observable, pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'med-test-details',
  templateUrl: './med-test-details.component.html',
  styleUrls: ['./med-test-details.component.scss']
})
export class MedTestDetailsComponent {
  medTest: IMedTest | null = null;
  showTest = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medTestService: MedTestService
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const key = params.get('id');
        if (key) {
          console.log("Requesting " + key);
          return this.medTestService.getMedTest(key);
        } else {
          console.log("NO KEY SPECIFIED!!!")
          return new Observable<any>();
        }
      })
    ).subscribe(data => {
      this.medTest = data;
      console.log(this.medTest);
      this.showTest = true;
    });
  }


  updateTest() {
    // TODO: set isUsed true and call API
  }
}
