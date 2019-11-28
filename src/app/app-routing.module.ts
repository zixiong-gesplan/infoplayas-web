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
import {LoginComponent} from './login/login.component';
import {WelcomeComponent} from './profile/welcome/welcome.component';

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {
        path: 'tecnicos',
        component: ProfileComponent,
        children: [
            {path: '', redirectTo: 'bienvenida', pathMatch: 'full'},
            {path: 'tecnicos', redirectTo: 'bienvenida', pathMatch: 'full'},
            {
                path: 'bienvenida', component: WelcomeComponent, canActivate: [AuthGuardService]
            },
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
                path: 'planos', component: ReportComponent, canActivate: [AuthGuardService]
            },
            {
                path: 'informes', component: ContactUsComponent, canActivate: [AuthGuardService]
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
