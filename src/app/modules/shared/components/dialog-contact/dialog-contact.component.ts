import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-contact',
  templateUrl: './dialog-contact.component.html',
  styleUrls: ['./dialog-contact.component.css']
})
export class DialogContactComponent implements OnInit {
  public contactForm: FormGroup;
  public contacts: any;
  public mask: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data)
  }

  ngOnInit() {
    this.contactForm = new FormGroup({
      type: new FormControl(null, Validators.required),
      value: new FormControl(null, Validators.required)
    })
    this.contacts = this.data.contacts;

    this.mask = {
      phone: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,],
      cell_phone: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    };
  }
}
