import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { HomeComponent } from './page/home/home.component';
import { CatalogueComponent } from './page/catalogue/catalogue.component';
import { LoginComponent } from './page/login/login.component';
import { PlanesComponent } from './page/planes/planes.component';
import { ProfileComponent } from './page/profile/profile.component';
import { DashboardsComponent } from './page/dashboards/dashboards.component';
import { ReportsComponent } from './page/reports/reports.component';
import { DownloadReportComponent } from './page/download-report/download-report.component';

import { UserProvider } from './provider/user';

import { BeachProvider } from './provider/beach';
import { IncidentProvider } from './provider/incident';
import { IncidentsComponent } from './page/incidents/incidents.component';
import { ReportProvider } from './provider/report';
import { ConfigProvider} from './provider/config';
import { PdfProvider } from './provider/pdf';
import { DatePipe } from '@angular/common';

import { PdfService } from './service/pdf.service';
import { ModalAddIncidentComponent } from './component/modal-add-incident/modal-add-incident.component';

import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';

import { environment } from '../environments/environment';
import { CecoesComponent } from './page/cecoes/cecoes.component';
import { RouterModule } from '@angular/router';
import { WorkfieldComponent } from './page/workfield/workfield.component';
import { DocumentsComponent } from './page/documents/documents.component';
import { DashboardPssComponent } from './page/dashboard-pss/dashboard-pss.component';
import { CecoesFallecidosAcumulativosComponent } from './page/cecoes-fallecidos-acumulativos/cecoes-fallecidos-acumulativos.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    CatalogueComponent,
    LoginComponent,
    PlanesComponent,
    ProfileComponent,
    DashboardsComponent,
    ReportsComponent,
    IncidentsComponent,
    ModalAddIncidentComponent,
    DownloadReportComponent,
    CecoesComponent,
    WorkfieldComponent,
    DocumentsComponent,
    DashboardPssComponent,
    CecoesFallecidosAcumulativosComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule, 
  ],
  providers: [
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
