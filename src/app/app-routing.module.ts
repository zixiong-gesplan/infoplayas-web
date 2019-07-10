import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {AuthGuardService} from './services/auth-guard.service';
import {HomeComponent} from './home/home.component';
import {CatalogueComponent} from './profile/catalogue/catalogue.component';

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'tecnicos', component: ProfileComponent, children: [
            {path: '', redirectTo: 'catalogo', pathMatch: 'full'},
            {path: 'tecnicos', redirectTo: 'catalogo', pathMatch: 'full'},
            {
                path: 'catalogo', component: CatalogueComponent, canActivate: [AuthGuardService],
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
