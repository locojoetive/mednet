import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MedTestDetailsComponent } from './med-test-details/med-test-details.component';
import { MedTestService } from './med-test.service';
import { UseMedTestComponent } from './use-med-test/use-med-test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';




@NgModule({
  declarations: [
    AppComponent,
    MedTestDetailsComponent,
    UseMedTestComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [MedTestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
