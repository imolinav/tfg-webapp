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

    console.log(entity)
      
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
      this.map.removeLayer(marker.marker)
    });
    this.markers = [];
    this.entitiesForm.reset(false, { emitEvent: false });
  }

  search(searchText: string) {}

  calculateRoute() {
    console.log(this.entitiesForm.value);
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
