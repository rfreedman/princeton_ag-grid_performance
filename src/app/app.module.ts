import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AgGridModule} from 'ag-grid-angular';
import {DataService} from './data-service';
import {HttpClientModule} from '@angular/common/http';
import {GridHelper} from './grid-helper';
import {MessageBusService} from './message-bus.service';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AgGridModule.withComponents([
    ])
  ],
  providers: [
    DataService,
    GridHelper,
    MessageBusService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
