import {Component, OnDestroy, OnInit} from '@angular/core';

import {DataService} from './data-service';
import {FinancialData} from './domain/financial-data';
import {GridHelper} from './grid-helper';
import {Subscription} from 'rxjs';
import {MessageBusService} from './message-bus.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  rowData: FinancialData[];
  messages: string[] = [];
  maxRows = 700;

  private subscriptions = new Subscription();

  constructor(private service: DataService, public gridHelper: GridHelper, private messageBus: MessageBusService) {
  }

  ngOnInit(): void {
    this.subscriptions.add(this.messageBus.getMessages().subscribe( (message) => {
      this.messages.push(`${new Date().toISOString()} ${message}`);
    }));
    this.getData();
  }

  getData() {
    if (this.validateMaxRows()) {
      this.messages = [];
      this.messageBus.postMessage('calling api')
      this.service.getData().pipe(map((allData) => allData.slice(0, this.maxRows)))
        .subscribe((data) => {
          this.messageBus.postMessage(`api call complete: ${data.length} rows`);
          this.replaceGridData(data);
        });
    }
  }

  replaceGridData(data: FinancialData[]) {
    setTimeout( () => {
      this.rowData = data;
      this.gridHelper.replaceGridData(this.rowData);
    }, 500);
  }

  clearData() {
    this.messages = [];
    this.gridHelper.clearData();
  }

  clearAndGetData() {
    if (this.validateMaxRows()) {
      this.messages = [];
      this.messageBus.postMessage('calling api')
      this.service.getData().pipe(map((allData) => allData.slice(0, this.maxRows)))
        .subscribe((data) => {
          this.messageBus.postMessage(`api call complete: ${data.length} rows`);
          this.clearAndReplaceGridData(data);
        });
    }
  }

  clearAndReplaceGridData(data: FinancialData[]) {
    setTimeout( () => {
      this.rowData = data;
      this.gridHelper.clearAndReplaceGridData(this.rowData);
    }, 500);
  }

  private validateMaxRows(): boolean {
    if (this.maxRows < 1) {
      this.messages = ['Max Rows cannot be less than one'];
      return false;
    }

    if (this.maxRows > 1000) {
      this.messages = ['Max Rows cannont be greater than 1000'];
      return false;
    }

    return true;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
