import {Injectable} from '@angular/core';
import {FinancialData} from './domain/financial-data';
import {GridApi} from 'ag-grid-community';
import {rightAlignStyle} from './cell-styles';
import {formatBigDecimalCurrency} from './cell-formatters';
import {MessageBusService} from './message-bus.service';
import {isDefined} from '@angular/compiler/src/util';

@Injectable()
export class GridHelper {

  private gridApi: GridApi;

  private operation: string;
  private data;
  private startTime: Date;
  private endTime: Date;

  private clearDuration: number;

  constructor(private messageBus: MessageBusService) {
  }

  public onGridReady(event) {
    console.log('grid ready', event);
    this.messageBus.postMessage('grid ready');
    this.gridApi = event.api;
    this.gridApi.setColumnDefs(this.getColumnDefs());
  }

  onRowDataChanged(event) {
    this.endOperation();
  }

  getRowNodeId(rowNode: FinancialData) {
    return rowNode.id;
  }

  replaceGridData(data: FinancialData[]) {
    this.startOperation('replaceGridData');
    setTimeout(() => {
      this.gridApi.setRowData(data);
    });
  }

  clearData() {
    this.startOperation('clearGridData only');
    setTimeout(() => {
      this.data = [];
      this.gridApi.setRowData([]);
    });
  }

  clearAndReplaceGridData(data: FinancialData[]) {
    this.startOperation('clearGridData');
    setTimeout(() => {
      this.data = data;
      this.gridApi.setRowData([]);
    });
  }


private getColumnDefs() {
    return [
      {
        headerName: 'Category',
        field: 'category',
        resizable: true,
        sortable: true,
        autoHeight: true,
        enableRowGroup: true,
        editable: true,
        rowGroup: true
      },
      {
        headerName: 'Classification',
        field: 'classification',
        resizable: true,
        sortable: true,
        autoHeight: true,
        enableRowGroup: true,
        editable: true,
        rowGroup: true
      },
      {
        headerName: 'Grouping',
        field: 'grouping',
        resizable: true,
        sortable: true,
        autoHeight: true,
        enableRowGroup: true,
        editable: true
      },
      {
        headerName: 'Description',
        field: 'line_item_description',
        resizable: true,
        sortable: true,
        autoHeight: true,
        enableRowGroup: true,
        editable: true
      },
      {
        headerName: 'Amount',
        field: 'amount',
        resizable: true,
        sortable: true,
        autoHeight: true,
        enableRowGroup: true,
        editable: true,
        cellStyle: rightAlignStyle,
        valueFormatter: formatBigDecimalCurrency
      },
      {
        headerName: 'Date',
        field: 'date',
        resizable: true,
        sortable: true,
        autoHeight: true,
        enableRowGroup: true,
        editable: true
      },
    ];
  }

  private logOperation(op: string) {
    this.messageBus.postMessage(op);
  }

  private startOperation(op: string) {
    this.operation = op;
    this.startTime = new Date();
    this.messageBus.postMessage(`${this.operation} start`);
  }

  private endOperation() {
    this.endTime = new Date();
    const duration = this.endTime.getTime() - this.startTime.getTime();
    this.messageBus.postMessage(`${this.operation} end - duration - ${duration} msec.`);

    if (isDefined(this.clearDuration)) {
      const fullDuration = duration + this.clearDuration;
      this.clearDuration = undefined;
      this.messageBus.postMessage(`clearAndReplace total duration - ${fullDuration} msec.`);
    }


    if (this.operation === 'clearGridData') {
      this.clearDuration = duration;
      this.startOperation('replaceGridData');

      setTimeout( () => {
        this.gridApi.setRowData(this.data);
      }, 100);
    }
  }
}
