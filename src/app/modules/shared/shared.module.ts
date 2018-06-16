import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';


/**
 * Guards
 */
import { AuthGuard } from './guards/auth.guard';

/**
 * Modules
 */
import { MaterialModule } from './material.module';

/**
 * Services
 */
import { AuthenticationService } from './services/firebase/authentication.service';
import { CrudService } from './services/firebase/crud.service';
import { StrategicDataService } from './services/strategic-data.service';

/**
 * Third party modules
 */
import { TextMaskModule } from 'angular2-text-mask';

/**
 * Components
 */
import { DeleteConfirmComponent } from './components/delete-confirm/delete-confirm.component';
import { DialogAddressComponent } from './components/dialog-address/dialog-address.component';
import { DialogCompanyComponent } from './components/dialog-company/dialog-company.component';
import { DialogContactComponent } from './components/dialog-contact/dialog-contact.component';
import { DialogDocumentComponent } from './components/dialog-document/dialog-document.component';
import { DialogPersonComponent } from './components/dialog-person/dialog-person.component';
import { DialogRelationshipComponent } from './components/dialog-relationship/dialog-relationship.component';
import { TableDataComponent } from './components/table-data/table-data.component';
import { TopbarMenuComponent } from './components/topbar-menu/topbar-menu.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    TextMaskModule,
    RouterModule
  ], exports: [
    DeleteConfirmComponent,
    DialogAddressComponent,
    DialogCompanyComponent,
    DialogContactComponent,
    DialogDocumentComponent,
    DialogPersonComponent,
    DialogRelationshipComponent,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    TableDataComponent,
    TextMaskModule,
    TopbarMenuComponent,
  ], providers: [
    AuthenticationService,
    AuthGuard,
    CrudService,
    StrategicDataService,
  ], declarations: [
    DeleteConfirmComponent,
    DialogAddressComponent,
    DialogCompanyComponent,
    DialogContactComponent,
    DialogDocumentComponent,
    DialogPersonComponent,
    DialogRelationshipComponent,
    TableDataComponent,
    TopbarMenuComponent,
  ], entryComponents: [
    DeleteConfirmComponent,
    DialogAddressComponent,
    DialogCompanyComponent,
    DialogContactComponent,
    DialogDocumentComponent,
    DialogPersonComponent,
    DialogRelationshipComponent,
  ]
})
export class SharedModule { }
