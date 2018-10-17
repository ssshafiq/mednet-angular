import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class RestService {

  constructor(private httpClient: HttpClient) {
  }

  setupDemo() {
    return this.httpClient.post('http://10.10.30.188:3001/api/mtbc.med.net.Patient', null, {withCredentials: true}).toPromise();
  }

  checkWallet() {
    return this.httpClient.get('http://10.10.30.188:3000/api/wallet', {withCredentials: true}).toPromise()   
  }

  signUp(data) {
    const collector = {
      $class: 'mtbc.med.net.Patient',
      patientId: data.id,
      patientSSNHash: data.firstName,
      patientInfoHash: data.surname,
      patientUrl: data.surname
    };

    return this.httpClient.post('http://10.10.30.188:3001/api/mtbc.med.net.Patient', collector).toPromise()
      .then(() => {
        const identity = {
          participant: 'mtbc.med.net.Patient#' + data.id,
          userID: data.id,
          options: {}
        };

        return this.httpClient.post('http://10.10.30.188:3001/api/system/identities/issue', identity, {responseType: 'blob'}).toPromise();
      })
      .then((cardData) => {
      console.log('CARD-DATA', cardData);
        const file = new File([cardData], Math.random().toString(36).substr(2, 9) + '-myCard.card', {type: 'application/octet-stream', lastModified: Date.now()});

        const formData = new FormData();
        formData.append('card', file);

        const headers = new HttpHeaders();
        headers.set('Content-Type', 'multipart/form-data');
        return this.httpClient.post('http://10.10.30.188:3000/api/wallet/import', formData, {
          withCredentials: true,
          headers
        }).toPromise()
        .then(res => console.log('---------------Successfully Imported------------', res));
      });
  }

  getCurrentUser() {
    return this.httpClient.get('http://10.10.30.188:3000/api/system/ping', {withCredentials: true}).toPromise()
      .then((data) => {
        return data['participant'];
      });
  }

  getAllPenguins() {
    return this.httpClient.get('http://10.10.30.188:3000/api/mtbc.med.net.Patient', {withCredentials: true}).toPromise();
  }

  getAvailablePenguins() {
    return this.httpClient.get('http://10.10.30.188:3000/api/queries/availablePenguins', {withCredentials: true}).toPromise();
  }

  getMyPenguins() {
    return this.httpClient.get('http://10.10.30.188:3000/api/queries/myPenguins', {withCredentials: true}).toPromise();
  }

  buyPenguin() {
    const transactionDetails = {
      $class: "mtbc.med.net.Patient",
      patientId: Date.now() + Math.random().toString(36).substr(2, 9) + '-TestPatient',
      patientSSNHash: '12345',
      patientInfoHash: '12345',
      patientUrl: 'www.mtbc.com'
    };
    
    return this.httpClient.post('http://10.10.30.188:3000/api/mtbc.med.net.Patient', transactionDetails, {withCredentials: true}).toPromise();
  }
}
