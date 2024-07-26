import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  public loginForm = new FormGroup({
    'email' : new FormControl(null,[Validators.required, Validators.email]),
    'password': new FormControl(null,[Validators.required])
  })    

  constructor(private formBuilder: FormBuilder) {
 
  }

  ngOnInit() {
  }

  login(){
    console.log(this.loginForm.value);
  }

}
