import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelPlannerRoutingModule } from './travel-planner-routing.module';
import { TravelPlannerComponent } from './travel-planner.component';


@NgModule({
  declarations: [
    TravelPlannerComponent
  ],
  imports: [
    CommonModule,
    TravelPlannerRoutingModule
  ]
})
export class TravelPlannerModule { }
