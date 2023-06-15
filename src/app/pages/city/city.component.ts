import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { City } from 'src/app/services/api/models/ApiModels';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScoreComponent } from './score/score.component';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
})
export class CityComponent implements OnInit {
  cityId: number;
  city: City;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cityId = Number(this.route.snapshot.paramMap.get('cityId'));
    this.apiService
      .getEntities(this.cityId)
      .subscribe((city) => (this.city = city));
  }

  navigateToPlanner(cityId: number) {
    this.router.navigate(['/travel-planner', cityId]);
  }

  addVoting(entityId: number, entityName: string) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      return;
    }
    const dialog = this.dialog.open(ScoreComponent, {
      data: {
        entityId,
        entityName
      },
    });
    dialog.afterClosed().subscribe((score) => {
      this.apiService.addEntityScore(entityId, user.id, score).subscribe((res) => {
        console.log(res);
      })
    })
  }
}
