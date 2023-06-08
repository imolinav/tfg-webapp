import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelPlannerComponent } from './travel-planner.component';

const routes: Routes = [
  { path: '', component: TravelPlannerComponent },
  { path: ':cityId', component: TravelPlannerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelPlannerRoutingModule { }
