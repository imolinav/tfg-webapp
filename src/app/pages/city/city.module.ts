import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityRoutingModule } from './city-routing.module';
import { CityComponent } from './city.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    CityComponent
  ],
  imports: [
    CommonModule,
    CityRoutingModule,
    MatButtonModule
  ]
})
export class CityModule { }
