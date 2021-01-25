import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedTestDetailsComponent } from './med-test-details/med-test-details.component';

const routes: Routes = [
  {path: 'medTest/:id', component: MedTestDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [MedTestDetailsComponent]