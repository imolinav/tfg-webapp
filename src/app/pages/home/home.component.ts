import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { Recommendations } from 'src/app/services/api/models/ApiModels';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  recommendations: Recommendations[];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getHomeRecommendations().subscribe(res => this.recommendations = res);
  }

}
