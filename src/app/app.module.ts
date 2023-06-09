import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AttractionModule } from './pages/attraction/attraction.module';
import { HomeModule } from './pages/home/home.module';
import { LoginModule } from './pages/login/login.module';
import { RecommendationsModule } from './pages/recommendations/recommendations.module';
import { TravelPlannerModule } from './pages/travel-planner/travel-planner.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './shared/header/header.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { CityModule } from './pages/city/city.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AttractionModule,
    CityModule,
    HomeModule,
    LoginModule,
    RecommendationsModule,
    TravelPlannerModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
