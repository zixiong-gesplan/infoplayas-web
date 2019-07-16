import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ProfileComponent} from './profile/profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HomeComponent } from './home/home.component';
import {CatalogueComponent} from './profile/catalogue/catalogue.component';
import { ClassificationComponent } from './profile/classification/classification.component';
import { SecurityComponent } from './profile/security/security.component';
import { ReportComponent } from './profile/report/report.component';
import { ContactUsComponent } from './profile/contact-us/contact-us.component';
import {LoginComponent} from './login/login.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        CatalogueComponent,
        ProfileComponent,
        HomeComponent,
        ClassificationComponent,
        SecurityComponent,
        ReportComponent,
        ContactUsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
