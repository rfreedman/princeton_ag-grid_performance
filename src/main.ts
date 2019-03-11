import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import {LicenseManager} from 'ag-grid-enterprise';

if (environment.production) {
  enableProdMode();
}

LicenseManager.setLicenseKey(
  'Princeton_University-Office_of_Information_Technology__MultiApp_9Devs21_November_2019__MTU3NDI5NDQwMDAwMA==89805b7ee39d73abd342c8be40ac1d7a'
);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

