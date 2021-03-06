import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AllMaterialModuleModule } from './all-material-module.module';
import { HeaderLinksComponent, HeaderUserComponent } from './components';
import { BusyComponent } from './components/busy/busy.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ForceGraphComponent } from './components/force-graph/force-graph.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { StateButtonComponent } from './components/state-button/state-button.component';
import { ThreeForceGraphComponent } from './components/three-force-graph/three-force-graph.component';
import { SnowDialogDirective } from './directives/snow-dialog.directive';
import { SnowInputDirective } from './directives/snow-input.directive';
import { NameFilterPipe } from './pipe/name-filter.pipe';
import { NoRightComponent } from './components/no-right/no-right.component';

@NgModule({
  declarations: [
    ForceGraphComponent,
    PageNotFoundComponent,
    BusyComponent,
    NameFilterPipe,
    ConfirmationDialogComponent,
    SnowDialogDirective,
    ThreeForceGraphComponent,
    HeaderLinksComponent,
    HeaderUserComponent,
    StateButtonComponent,
    SnowInputDirective,
    NoRightComponent
  ],
  imports: [
    CommonModule,
    AllMaterialModuleModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    ForceGraphComponent,
    ThreeForceGraphComponent,
    PageNotFoundComponent,
    BusyComponent,
    NameFilterPipe,
    ConfirmationDialogComponent,
    SnowDialogDirective,
    HeaderLinksComponent,
    HeaderUserComponent,
    SnowInputDirective,
  ],
})
export class SharedModule { }
