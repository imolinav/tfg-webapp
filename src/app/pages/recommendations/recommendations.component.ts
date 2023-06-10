import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { City, Recommendations, User } from 'src/app/services/api/models/ApiModels';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {

  recommendations: City[];
  user: User;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (!this.user) {
      this.apiService.getRecommendations().subscribe((res) => {
        this.recommendations = res;
      });
    } else {
      this.apiService.getRecommendationsByUser(this.user.id).subscribe((res) => {
        this.recommendations = res;
      });
    }
  }

}
