import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { AssetService } from './table/asset.service';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [AssetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
