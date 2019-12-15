import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FireService } from '../services/fire.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login_form: FormGroup
  logeo: any

  constructor(private route: Router, private api: FireService, private formBuilder: FormBuilder) {
    this.login_form = this.formBuilder.group({
      'correo': ["", Validators.required],
      'password': ["", Validators.required]
    })
  }

  ngOnInit() {
  }

  login(){
    let datos:any
    this.api.searchEmail(this.login_form.get('correo').value).subscribe(result =>{
      this.logeo = result
      if(result.length > 0){
        if(this.logeo[0].payload.doc.data().password == this.login_form.get('password').value && this.logeo[0].payload.doc.data().correo == this.login_form.get('correo').value){
          console.log(this.logeo)
          this.route.navigateByUrl("/admin")
        }else{
          console.log("Credenciales incorrectas")
        }
      }else{
        console.log("No entra")
      }
    })
  }

}
