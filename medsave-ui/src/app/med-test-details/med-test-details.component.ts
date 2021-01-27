import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IMedTest } from '../IMedTest';
import { MedTestService } from '../med-test.service';

enum State {
  INITIALIZING,
  INITIALIZED,
  UPDATING,
  UPDATED,
  UPDATE_FAILED,
  NO_DATA
}

@Component({
  selector: 'med-test-details',
  templateUrl: './med-test-details.component.html',
  styleUrls: ['./med-test-details.component.scss']
})
export class MedTestDetailsComponent {
  medTest: IMedTest = new IMedTest();
  key = "";
  State = State;
  state: State = State.INITIALIZING;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medTestService: MedTestService
  ) { }

  ngOnInit() {
    this.fetchMedTest();
  }

  fetchMedTest() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const key = params.get('id');
        this.state = State.INITIALIZING;
        setTimeout(() => {
          if (this.state == State.INITIALIZING)
            this.state = State.NO_DATA;
        }, 7000)
        if (key) {
          this.key = key;
          console.log("Requesting " + key);
          return this.medTestService.getMedTest(key);
        } else {
          console.log("NO KEY SPECIFIED!!!")
          this.state = State.NO_DATA;
          return new Observable<any>();
        }
      })
    ).subscribe(data => {
      console.log("incoming data...", data);
      this.medTest = data;
      if (this.medTest) {
        this.medTest.key = this.key;
        console.log(this.medTest);
        this.state = State.INITIALIZED;
      } else {
        this.state = State.NO_DATA;
      }
    });
  }

  updateTest() {
    if (this.medTest != null) {
      console.log("Start updating....");
      this.state = State.UPDATING;
      this.medTestService.setMedTestAsUsed(this.medTest).subscribe({
        next: data => {
          console.log("UPDATE successful: " + data);
          this.state = State.UPDATED;
        },
        error: error => {
          console.log('UPDATE failed: ', error);
          this.state = State.UPDATE_FAILED;
        }
      });
    }
  }

  isUsed(): boolean {
    return this.medTest != null && this.medTest.isUsed;
  }

  isInState(state: State): boolean {
    console.log("Is ", this.state, " = ", state, "? ", this.state == state);
    return this.state == state;
  }

  dataAvailable(): boolean {
    console.log("Data Available: ", !(this.state == State.NO_DATA || this.state == State.INITIALIZING));
    return !(this.state == State.NO_DATA || this.state == State.INITIALIZING);
  }

  isInitialized(): boolean {
    console.log("Data Available: ", !(this.state == State.INITIALIZING || this.state == State.NO_DATA))
    return !(this.state == State.INITIALIZING || this.state == State.NO_DATA);
  }
}
