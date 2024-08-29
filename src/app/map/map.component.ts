import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../data.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true,
})
export class MapComponent implements OnInit {
  private map: any;
  data: any;

  constructor(@Inject(PLATFORM_ID) private platformId: object, private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData()
      .then(response => {
        this.data = response;
        if (isPlatformBrowser(this.platformId)) {
          this.initMap();
        }
      })
      .catch(error => {
        console.error('Error fetching data', error);
      });
  }

  private async initMap(): Promise<void> {
    const L = await import('leaflet');

    this.map = L.map('map').setView([38.5449, -121.7405], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(this.map);

    const arrayData = this.data.d;

    arrayData.map((crime: any) => {
      const longitude = crime.Longitude;
      const latitude = crime.Latitude;
      const icon = crime.Icon;
      const mapIcon = L.icon({
        iconUrl: icon
      });

      const marker = L.marker([latitude, longitude], { icon: mapIcon }).addTo(this.map);
      const popupContent = `<p>${crime.Description}</p>`;
      marker.bindPopup(popupContent);
    });

    // Adding a custom "Post Data" button to the map
    const PostDataControl = L.Control.extend({
      onAdd: () => {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        div.innerHTML = '<button>Post Crime Data</button>';
        div.style.backgroundColor = 'white';
        div.style.padding = '5px';
        div.style.cursor = 'pointer';

        div.onclick = () => {
          this.postCrimeData();
        };

        return div;
      },
    });

    // Add the control to the map
    const postDataControl = new PostDataControl({ position: 'topright' });
    postDataControl.addTo(this.map);
  }

  private postCrimeData(): void {
    // Logic to post crime data
    console.log('Posting crime data:', this.data);
    // Implement your data posting logic here, e.g., make an HTTP POST request
  }
  

}
