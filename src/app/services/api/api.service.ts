import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pluck } from 'rxjs';
import { Entity, Recommendations } from './models/ApiModels';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getHomeRecommendations(): Observable<Recommendations[]> {
    return this.http
      .get<{ recommendations: Recommendations[] }>(
        `${this.BASE_URL}/home-recommendations`
      )
      .pipe(pluck('recommendations'));
  }

  getRecommendations(): Observable<Recommendations[]> {
    return this.http
      .get<{ recommendations: Recommendations[] }>(
        `${this.BASE_URL}/recommendations`
      )
      .pipe(pluck('recommendations'));
  }

  getCities(): Observable<Recommendations[]> {
    return this.http
      .get<{ cities: Recommendations[] }>(`${this.BASE_URL}/planner`)
      .pipe(pluck('cities'));
  }

  getEntities(cityId: number): Observable<Entity[]> {
    return this.http
      .get<{ city: Entity[] }>(`${this.BASE_URL}/planner/${cityId}`)
      .pipe(pluck('city'));
  }
}
