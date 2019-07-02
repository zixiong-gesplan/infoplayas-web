import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {AuthGuardService} from './services/auth-guard.service';

const routes: Routes = [
    {path: '', redirectTo: '/', pathMatch: 'full'},
    {path: 'tecnicos', component: ProfileComponent, canActivate: [AuthGuardService]},
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
