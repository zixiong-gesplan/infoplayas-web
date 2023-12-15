import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogueComponent } from './page/catalogue/catalogue.component';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './page/login/login.component';
import { PlanesComponent } from './page/planes/planes.component';
import { ProfileComponent } from './page/profile/profile.component';

import {UserGuardGuard} from './guards/user-guard.guard';
import { DashboardsComponent } from './page/dashboards/dashboards.component';
import { ReportsComponent } from './page/reports/reports.component';
import { IncidentsComponent } from './page/incidents/incidents.component';
import {DownloadReportComponent} from './page/download-report/download-report.component'
import { CecoesComponent } from './page/cecoes/cecoes.component';
import { WorkfieldComponent } from './page/workfield/workfield.component';
import { DocumentsComponent } from './page/documents/documents.component';
import { DashboardPssComponent } from './page/dashboard-pss/dashboard-pss.component';
import { CecoesFallecidosAcumulativosComponent } from './page/cecoes-fallecidos-acumulativos/cecoes-fallecidos-acumulativos.component';


const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'catalogo', component:CatalogueComponent},
  {path:'planos', component:PlanesComponent},
  {path:'cecoes',component:CecoesComponent},
  {path:'cecoes-fallecias-acumulativos',component:CecoesFallecidosAcumulativosComponent},
  // {path:'login', component:LoginComponent},
  {path:'trabajo-campo', component:WorkfieldComponent},
  {path:'dashboards', component:DashboardsComponent},
  {path:'documents', component:DocumentsComponent},
  {path:'dashboard-pss', component:DashboardPssComponent},
  // {path:'tecnicos', component:ProfileComponent, canActivate:[UserGuardGuard]},
  // {path:'reports', component:ReportsComponent, canActivate:[UserGuardGuard]},
  // {path:'incidents', component:IncidentsComponent, canActivate: [UserGuardGuard]},
  // {path:'downloads', component:DownloadReportComponent, canActivate: [UserGuardGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
