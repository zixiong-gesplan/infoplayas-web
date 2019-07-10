import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {AuthGuardService} from './services/auth-guard.service';
import {HomeComponent} from './home/home.component';
import {CatalogueComponent} from './profile/catalogue/catalogue.component';
import {ClassificationComponent} from './profile/classification/classification.component';
import {SecurityComponent} from './profile/security/security.component';
import {ReportComponent} from './profile/report/report.component';
import {ContactUsComponent} from './profile/contact-us/contact-us.component';

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {
        path: 'tecnicos',
        component: ProfileComponent,
        children: [
            {path: '', redirectTo: 'catalogo', pathMatch: 'full'},
            {path: 'tecnicos', redirectTo: 'catalogo', pathMatch: 'full'},
            {
                path: 'catalogo', component: CatalogueComponent, canActivate: [AuthGuardService]
            },
            {
                path: 'clasificacion', component: ClassificationComponent, canActivate: [AuthGuardService]
            },
            {
                path: 'seguridad', component: SecurityComponent, canActivate: [AuthGuardService]
            },
            {
                path: 'informes', component: ReportComponent, canActivate: [AuthGuardService]
            },
            {
                path: 'contacto', component: ContactUsComponent, canActivate: [AuthGuardService]
            }
        ]
    },
    {path: '**', redirectTo: '/home'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
