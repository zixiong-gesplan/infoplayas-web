import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { UserProvider } from './app/provider/user';
import { BeachProvider } from './app/provider/beach';
import { IncidentProvider } from './app/provider/incident';
import { ReportProvider } from './app/provider/report';
import { ConfigProvider } from './app/provider/config';
import { PdfProvider } from './app/provider/pdf';
import { DatePipe } from '@angular/common';
import { PdfService } from './app/service/pdf.service';
import { RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app-routing.module';
import { RouterModule } from '@angular/router';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, AppRoutingModule, RouterModule, RecaptchaModule, RecaptchaFormsModule),
        UserProvider,
        BeachProvider,
        IncidentProvider,
        ReportProvider,
        ConfigProvider,
        PdfProvider,
        DatePipe,
        PdfService,
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: {
                siteKey: environment.recaptchaKey.siteKey,
            } as RecaptchaSettings,
        },
        provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
