import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { City } from 'src/app/services/api/models/ApiModels';
import * as Leaflet from 'leaflet';
import {
  DetailResult,
  NominatimService,
  SearchResult,
} from 'src/app/services/nominatim/nominatim.service';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = Leaflet.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
Leaflet.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-travel-planner',
  templateUrl: './travel-planner.component.html',
  styleUrls: ['./travel-planner.component.scss'],
})
export class TravelPlannerComponent implements OnInit {
  cities: City[];
  city: City;
  cityId: string;
  pageType: 'cityList' | 'attractionList' = 'cityList';

  lat = 39.46987;
  lon = -0.37673;
  zoom = 14;
  markers: { entityId: number; marker: any }[] = [];
  distancesMatrix = [];

  resultShape: Leaflet.Polygon;
  searchResult: SearchResult[];
  selectedBuilding: DetailResult;
  hasIFC = false;
  searching = false;
  dataHeaders = {
    26: 'Calle',
    16: 'Población',
    12: 'Zona',
    10: 'Provincia',
    8: 'Comunidad autónoma',
    5: 'Código postal',
    4: 'País',
  };
  resultTypes: {
    type: string;
    data: {
      text: string;
      icon: string;
    };
  }[];
  entitiesForm: FormGroup = this.fb.group({});
  formReady = false;

  private map: Leaflet.Map;

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [this.city.latitude, this.city.longitude],
      zoom: this.zoom,
      zoomControl: false,
    });
    Leaflet.control.scale().addTo(this.map);
    this.map.addEventListener('zoom', (event) => {
      this.zoom = event.target._zoom;
    });
    const tiles = Leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
  }

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private nominatimService: NominatimService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cityId = this.route.snapshot.paramMap.get('cityId');
    if (this.cityId) {
      this.pageType = 'attractionList';
      this.apiService.getEntities(Number(this.cityId)).subscribe((city) => {
        this.city = city;
        city.attractions.forEach((entity) => {
          this.entitiesForm.addControl(
            entity.id.toString(),
            this.fb.control('')
          );
        });
        city.restaurants.forEach((entity) => {
          this.entitiesForm.addControl(
            entity.id.toString(),
            this.fb.control('')
          );
        });
        this.entitiesForm.addValidators(
          this.requireCheckboxesToBeCheckedValidator()
        );
        this.formReady = true;
        if (this.pageType === 'attractionList') {
          this.initMap();
        }
      });
    } else {
      this.apiService.getCities().subscribe((cities) => (this.cities = cities));
    }
  }

  updateSelected(event, entityId: number, entityType: string) {
    const entity =
      entityType === 'restaurants'
        ? this.city.restaurants.find((r) => r.id === entityId)
        : this.city.attractions.find((a) => a.id === entityId);

    if (!event.target.checked) {
      const markerIndex = this.markers
        .map((marker) => marker.entityId)
        .indexOf(entityId);
      this.map.removeLayer(this.markers[markerIndex].marker);
      this.markers.splice(markerIndex, 1);
    } else {
      this.searching = true;
      this.nominatimService
        .search(entity.name, this.city.name)
        .subscribe((res: SearchResult[]) => {
          if (res.length > 0) {
            this.searchResult = res;
            const result = res.find(
              (element) => element.display_name.indexOf(this.city.name) > -1
            );
            const marker = Leaflet.marker([
              Number(result.lat),
              Number(result.lon),
            ]);
            this.markers.push({ entityId, marker });
            marker.addTo(this.map);
            this.searching = false;
          }
        });
    }
  }

  cleanSelection() {
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker.marker);
    });
    this.markers = [];
    this.entitiesForm.reset(false, { emitEvent: false });
  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }

  localize() {
    this.map.locate({ setView: true });
  }

  calculateRoute() {
    this.markers.forEach((marker, i) => {
      let subDistancesArray = [];
      this.markers.forEach((subMarker, j) => {
        if (i === j) {
          subDistancesArray.push({
            from: marker.entityId,
            to: subMarker.entityId,
            distance: 0,
          });
        } else {
          subDistancesArray.push({
            from: marker.entityId,
            to: subMarker.entityId,
            distance: this.map.distance(
              marker.marker._latlng,
              subMarker.marker._latlng
            ),
          });
        }
      });
      this.distancesMatrix.push(subDistancesArray);
    });
    this.calculateTSP();
  }

  private calculateTSP() {
    const answer = this.sanTsp();
  }

  private sanTsp() {
    const tspOptions = {
      N: 10000,
      T: 70,
      lambda: 0.95,
      round: 100,
    };

    let T = tspOptions.T;
    const path = this.randomPath();
    let current = {
      path: path,
      cost: this.pathCost(path),
    };

    let answer = {
      initial: current,
      final: null,
    };

    console.log('Starting SAN-TPS');

    for (let i = 1; i < tspOptions.N; i++) {
      current = this.calculateCurrent(current);
      if (i % tspOptions.round) {
        T = this.anneal(T, tspOptions.lambda);
      }
      console.log(`Iteration ${i}`, current);
    }
    console.log('Finished SAN-TPS', current);
    answer.final = current;
    return answer;
  }

  private randomPath() {
    const markersIds = this.markers.map((marker) => marker.entityId);
    for (let i = markersIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = markersIds[i];
      markersIds[i] = markersIds[j];
      markersIds[j] = temp;
    }
    markersIds.push(markersIds[0]);
    return markersIds;
  }

  private pathCost(path: number[]) {
    let totalCost = 0;
    for (let i = 0; i < path.length; i++) {
      this.distancesMatrix.forEach((row) => {
        row.forEach((column: { from: number, to: number, distance: number }) => {
          if (column.from === path[i] && column.to === path[i + 1]) {
            totalCost += column.distance;
          }
        });
      });
    }
    return totalCost;
  }

  private calculateCurrent(current: { path: number[], cost: number }) {
    let newPath: number[];
    do {
      newPath = this.randomPath();
    } while (this.areEqual(current.path, newPath));
    return current.cost > this.pathCost(newPath)
      ? {
          path: newPath,
          cost: this.pathCost(newPath),
        }
      : current;
  }

  private anneal(T: number, lambda: number): number {
    return T * lambda;
  }

  private areEqual(current: number[], newPath: number[]): boolean {
    if (
      current.length !== newPath.length ||
      current == null ||
      newPath == null
    ) {
      return false;
    }
    let equal = true;
    for (let i = 0; i < current.length; i++) {
      if (current[i] !== newPath[i]) {
        equal = false;
      }
    }
    return equal;
  }

  private requireCheckboxesToBeCheckedValidator(minRequired = 2): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let checked = 0;
      Object.keys(formGroup.controls).forEach((key) => {
        const control = formGroup.controls[key];
        if (control.value === true) {
          checked++;
        }
      });
      if (checked < minRequired) {
        return {
          requireCheckboxesToBeChecked: true,
        };
      }
      return null;
    };
  }
}
