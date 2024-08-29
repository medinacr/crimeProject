// src/app/data.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = '/api/2013/MapData.asmx/GetLiveMapPoints'; 

  constructor() {}

  getFormattedDate(): string {
    const date = new Date();
    return `${
      (date.getMonth() + 1).toString().padStart(2, '0')
    }/${
      date.getDate().toString().padStart(2, '0')
    }/${
      date.getFullYear().toString().slice(-2)
    }`;
  }

  getData(): Promise<any> {
    const formattedDate = this.getFormattedDate();
    const payload = {
      "AGCODE": "DPD",
      "StartDate": formattedDate,
      "EndDate": formattedDate,
      "MapType": "I",
      "GroupTypes": "TRAFFIC,10851,BURGLARY,ASSAULT,ROBBERY,NARC,DISTURB,THEFT,VANDAL,OTHER,HOMICIDE,MP,TRESPASS,FIREMED,NOISE,CITY,ANIMAL,ARSON,FRAUD,SEXCRIME,ALC",
      "CirLat": 0,
      "CirLon": 0,
      "CirRad": 0
    };

    return axios.post(this.apiUrl, payload, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Error:', error.response ? error.response.data : error.message);
      throw error;
    });
  }
}
