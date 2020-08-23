import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AllMaterialModuleModule } from './all-material-module.module';
import { HeaderLinksComponent, HeaderUserComponent } from './components';
import { BusyComponent } from './components/busy/busy.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ForceGraphComponent } from './components/force-graph/force-graph.component';
import { HeaderPreviousComponent } from './components/header/header-previous/header-previous.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SnowComponent } from './components/snow/snow.component';
import { ThreeForceGraphComponent } from './components/three-force-graph/three-force-graph.component';
import { SnowDialogDirective } from './directives/snow-dialog.directive';
import { NameFilterPipe } from './pipe/name-filter.pipe';

@NgModule({
  declarations: [
    ForceGraphComponent,
    PageNotFoundComponent,
    BusyComponent,
    HeaderUserComponent,
    HeaderLinksComponent,
    HeaderPreviousComponent,
    NameFilterPipe,
    ConfirmationDialogComponent,
    SnowComponent,
    SnowDialogDirective,
    ThreeForceGraphComponent
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
    HeaderLinksComponent,
    HeaderUserComponent,
    HeaderPreviousComponent,
    NameFilterPipe,
    ConfirmationDialogComponent,
    SnowComponent,
    SnowDialogDirective
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ]
})
export class SharedModule { }
