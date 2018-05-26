import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Components
 */
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SystemComponent } from './system.component';
import { TopbarMenuComponent } from './../shared/components/topbar-menu/topbar-menu.component';
import { ProductComponent, DialogFormComponent } from './components/product/product.component';
import { ServiceComponent, DialogFormServiceComponent } from './components/service/service.component';

/**
 * Modules
 */
import { SharedModule } from './../shared/shared.module';
import { SystemRoutingModule } from './system-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SystemRoutingModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    DialogFormComponent,
    DialogFormServiceComponent,
    SystemComponent,
    TopbarMenuComponent,
    ProductComponent,
    ServiceComponent
  ],
  entryComponents: [
    DialogFormComponent,
    DialogFormServiceComponent,
  ]
})
export class SystemModule { }
