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

/**
 * Third party modules
 */
import { TextMaskModule } from 'angular2-text-mask';

/**
 * Components
 */
import { DeleteConfirmComponent } from './components/delete-confirm/delete-confirm.component';
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
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    TableDataComponent,
    TextMaskModule,
    TopbarMenuComponent,
  ], providers: [
    AuthenticationService,
    AuthGuard,
    CrudService
  ], declarations: [
    DeleteConfirmComponent,
    TableDataComponent,
    TopbarMenuComponent
  ], entryComponents: [
    DeleteConfirmComponent
  ]
})
export class SharedModule { }
