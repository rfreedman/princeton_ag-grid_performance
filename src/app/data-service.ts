import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {FinancialData} from './domain/financial-data';
import {FinancialDataDto} from './domain/financial-data-dto';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {LocalDate} from 'js-joda';
import {Big as BigDecimal} from 'big.js';

import * as uuid from 'uuid/v4';


@Injectable()
export class DataService {
  constructor(private http: HttpClient) {
  }

  public getData(): Observable<FinancialData[]> {
    return this.http.get<FinancialDataDto[]>('https://finances.worldbank.org/resource/cvjk-iddq.json').pipe(
      map((data) => {
        return data.map((dto) => {
          return Object.assign(
            new FinancialData(),
            dto,
            {
              id: uuid(),
              amount: new BigDecimal(dto.amount),
              date: LocalDate.parse(dto.year.substring(0, 10))
            });
        });
      })
    );
  }
}

