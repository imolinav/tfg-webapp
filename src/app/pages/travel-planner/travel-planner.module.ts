import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelPlannerRoutingModule } from './travel-planner-routing.module';
import { TravelPlannerComponent } from './travel-planner.component';
import { MatIconModule } from '@angular/material/icon';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    TravelPlannerComponent
  ],
  imports: [
    CommonModule,
    TravelPlannerRoutingModule,
    MatIconModule,
    MatButtonModule,
    LeafletModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TravelPlannerModule { }
