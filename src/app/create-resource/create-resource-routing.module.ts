import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateResourceComponent } from './create-resource.component';

const routes: Routes = [{ path: '', component: CreateResourceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateResourceRoutingModule { }
