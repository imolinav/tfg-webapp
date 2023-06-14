import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { City } from 'src/app/services/api/models/ApiModels';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {

  cityId: number;
  city: City;

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.cityId = Number(this.route.snapshot.paramMap.get('cityId'));
    this.apiService.getEntities(this.cityId).subscribe((city) => this.city = city);
  }

}
