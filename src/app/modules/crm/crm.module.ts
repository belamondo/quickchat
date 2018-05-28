import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Components
 */
import { CrmComponent } from './crm.component';

/**
 * Modules
 */
import { ClientComponent, DialogDocumentForm, DialogContactForm } from './components/client/client.component';
import { CrmRoutingModule } from './crm-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';

/**
 * Modules
 */
import { SharedModule } from './../shared/shared.module';
import { AddressComponent } from './components/client/address.component';

@NgModule({
  imports: [
    CommonModule,
    CrmRoutingModule,
    SharedModule
  ],
  declarations: [
    ClientComponent,
    CrmComponent,
    DashboardComponent,
    DialogContactForm,
    DialogDocumentForm,
    AddressComponent,
  ], 
  entryComponents: [
    AddressComponent,
    DialogContactForm,
    DialogDocumentForm
  ]
})
export class CrmModule { }
