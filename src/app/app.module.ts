import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
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
import {
    CheckboxModule, ConfirmationService, ConfirmDialogModule, DropdownModule,
    InputTextareaModule,
    InputTextModule, MessageService, OverlayPanelModule, ProgressBarModule, RadioButtonModule, SelectButtonModule,
    TabMenuModule,
    TabViewModule,
    ToggleButtonModule,
    TooltipModule,
    AccordionModule, DialogModule, LightboxModule, SidebarModule, DialogService
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {EsriRequestService} from './services/esri-request.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CalendarModule} from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomeComponent } from './profile/welcome/welcome.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import {registerLocaleData} from '@angular/common';
import localeEs from '@angular/common/locales/es';
import {ToastModule} from 'primeng/toast';
import { MapViewerComponent } from './profile/map-viewer/map-viewer.component';
import {ResponseInterceptorService} from './services/response-interceptor.service';
import {DynamicDialogComponent, DynamicDialogModule} from 'primeng/dynamicdialog';

registerLocaleData(localeEs, 'es');

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
        MapEditorComponent,
        WelcomeComponent,
        MapViewerComponent
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
        InputTextareaModule,
        InputTextModule,
        CalendarModule,
        BrowserAnimationsModule,
        Ng4LoadingSpinnerModule.forRoot(),
        CheckboxModule,
        TooltipModule,
        OverlayPanelModule,
        DropdownModule,
        RadioButtonModule,
        SelectButtonModule,
        ToastModule,
        ConfirmDialogModule,
        ProgressBarModule,
        AccordionModule,
        DialogModule,
        LightboxModule,
        SidebarModule,
        DynamicDialogModule
    ],
    providers: [DialogService, EsriRequestService, MessageService, ConfirmationService, {
        provide: LOCALE_ID,
        useValue: 'es'
    },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ResponseInterceptorService,
            multi: true
        }],
    entryComponents: [DynamicDialogComponent, MapViewerComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
