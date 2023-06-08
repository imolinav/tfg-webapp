import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttractionRoutingModule } from './attraction-routing.module';
import { AttractionComponent } from './attraction.component';


@NgModule({
  declarations: [
    AttractionComponent
  ],
  imports: [
    CommonModule,
    AttractionRoutingModule
  ]
})
export class AttractionModule { }
