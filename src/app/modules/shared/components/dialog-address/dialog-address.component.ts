import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Http, RequestOptions, Headers } from '@angular/http';

@Component({
  selector: 'app-dialog-address',
  templateUrl: './dialog-address.component.html',
  styleUrls: ['./dialog-address.component.css']
})
export class DialogAddressComponent implements OnInit {
  public addressForm: FormGroup;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _http: Http
  ) { }

  ngOnInit() {
    this.addressForm = new FormGroup({
      zip: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      district: new FormControl(null, Validators.required),
      number: new FormControl(null),
      complement: new FormControl(null),
      state: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
    })
  }

  findAddress = (zipCode) => {
    let headersToAuth = new Headers({
      'Access-Control-Allow-Origin': '*'
    });

    let optionsToAuth = new RequestOptions({
      'headers': headersToAuth
    })


    this._http
    .post(
      'https://us-central1-quickstart-belamondo.cloudfunctions.net/apiAddress',
      {
        zipCode: zipCode
      },
      optionsToAuth
    ).subscribe(res => {
      console.log(res)
    }, rej => {
      console.log(rej)
    })
    console.log(zipCode)
  }
}
