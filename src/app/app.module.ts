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
import { MapEditorComponent } from './profile/map-editor/map-editor.component';
import {TabMenuModule, TabViewModule, ToggleButtonModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {EsriRequestService} from './services/esri-request.service';
import {HttpClientModule} from '@angular/common/http';
import {CalendarModule} from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

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
        MapEditorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        TabMenuModule,
        TabViewModule,
        TableModule,
        HttpClientModule,
        ToggleButtonModule,
        CalendarModule,
        BrowserAnimationsModule,
        Ng4LoadingSpinnerModule.forRoot(),

    ],
    providers: [EsriRequestService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
