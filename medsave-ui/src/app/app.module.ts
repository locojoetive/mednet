import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MedTestDetailsComponent } from './med-test-details/med-test-details.component';
import { UseMedTestComponent } from './use-med-test/use-med-test.component';
import { HttpClientModule } from '@angular/common/http';
import { MedTestService } from './med-test.service';

@NgModule({
  declarations: [
    AppComponent,
    MedTestDetailsComponent,
    UseMedTestComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [MedTestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
