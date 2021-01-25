import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { MainViewComponent } from './main-view/main-view.component';
import { MedTestTableComponent } from './main-view/med-test-table/med-test-table.component';
import { MedTestService } from './med-test.service';
import { MedTestFormComponent } from './main-view/med-test-form/med-test-form.component';

@NgModule({
  declarations: [
    AppComponent,
    MedTestTableComponent,
    MainViewComponent,
    MedTestFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [MedTestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
