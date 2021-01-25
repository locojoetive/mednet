import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IMedTest } from '../IMedTest';
import { MedTestService } from '../med-test.service';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'med-test-details',
  templateUrl: './med-test-details.component.html',
  styleUrls: ['./med-test-details.component.scss']
})
export class MedTestDetailsComponent {
  medTest: IMedTest | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medTestService: MedTestService
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        let key = params.get('id');
        if (key) {
          key = key?.substr(1, key.length - 1);
          console.log("Requesting " + key);
          return this.medTestService.getMedTest(key);
        } else {
          console.log("NO KEY SPECIFIED!!!")
          return new Observable<any>();
        }
      })
    ).subscribe((medTest: IMedTest) =>{
      console.log(medTest);
      this.medTest = medTest;
    })
  }
}
