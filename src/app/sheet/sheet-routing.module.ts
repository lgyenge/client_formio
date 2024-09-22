import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { SheetComponent } from './sheet.component';
import { FindFormComponent } from './find-form/find-form.component';
import { DisplayFormComponent } from './display-form/display-form.component';

//const routes: Routes = [{ path: '', component: SheetComponent }];
//const routes: Routes = [{ path: '', component: DisplayFormComponent}]
const routes: Routes = [{ path: '', component: FindFormComponent}]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SheetRoutingModule { }
