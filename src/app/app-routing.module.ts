import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'attraction', loadChildren: () => import('src/app/pages/attraction/attraction.module').then((m) => m.AttractionModule) },
  { path: 'city', loadChildren: () => import('src/app/pages/city/city.module').then((m) => m.CityModule) },
  { path: 'home', loadChildren: () => import('src/app/pages/home/home.module').then((m) => m.HomeModule) },
  { path: 'login', loadChildren: () => import('src/app/pages/login/login.module').then((m) => m.LoginModule) },
  { path: 'recommendations', loadChildren: () => import('src/app/pages/recommendations/recommendations.module').then((m) => m.RecommendationsModule) },
  { path: 'travel-planner', loadChildren: () => import('src/app/pages/travel-planner/travel-planner.module').then((m) => m.TravelPlannerModule) },
  { path: '**', pathMatch: 'full', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
