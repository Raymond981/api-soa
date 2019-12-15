import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'app-autobus',
  templateUrl: './autobus.component.html',
  styleUrls: ['./autobus.component.css']
})
export class AutobusComponent implements OnInit {
  id_autobus: any
  id_viaje: any

  elements: Elements;
  card: StripeElement;

  elementsOptions: ElementsOptions = {
    locale: 'es'
  };

  asientoSeleccionado: any

  parametros: any

  boletos: any = []

  redondo: any

  registrar_boleto: FormGroup

  autobus: any
  viaje: any
  
  id_redondo:any = 0
  bandera:any =0

  list_autobuses: any
  ciudades:any


  procesoPago:any = 0
  redon:any

  tipos:any = ['Sencillo', 'Doble']

  datosDePago:any

  constructor(private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder, private stripeService: StripeService, private ruta: Router) {
    this.registrar_boleto = this.formBuilder.group({
      'nombre': ['', Validators.required],
      'correo': ['', Validators.required],
      'tipo': ['', Validators.required],
      'asiento': ['', Validators.required]
    })

    this.route.params.subscribe(params =>
      this.parametros = params
    );

    this.id_viaje = this.parametros.idViaje
    this.id_autobus = this.parametros.id
  }

  ngOnInit() {

    this.api.getCiudades().subscribe(result =>{
      this.ciudades = result
    })

    this.api.getAutobuses().subscribe(result =>{
      this.list_autobuses = result
    })

    this.api.getBoletos({id_autobus: this.id_autobus, id_viaje: this.id_viaje}).subscribe(result =>{
      console.log(result)
      this.boletos = result
    })

    this.api.obtenerAutobus(this.id_autobus).subscribe(result =>{
      console.log(result)
      this.autobus = result
    })

    this.api.obtenerViaje(this.id_viaje).subscribe(result =>{
      console.log(result)
      this.viaje = result
    })

    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
        if (!this.card) {
          this.card = this.elements.create('card', {
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#31325F',
                lineHeight: '40px',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                  color: '#CFD7E0'
                }
              }
            }
          });
          this.card.mount('#card-element');
        }
      });
  }

  reservarBoleto(numeroAsiento: any) {
    console.log(numeroAsiento)
    this.asientoSeleccionado = numeroAsiento
    this.registrar_boleto.patchValue({asiento: this.asientoSeleccionado})
  }

  /*
    const id_autobus = request.input('id_autobus')
    const id_viaje = request.input('id_viaje')
    const nombre = request.input('nombre')
    const tipo = request.input('tipo')
  */
  click(){
    this.bandera = 1
    console.log(this.bandera)
    this.api.obtenerViajePorAutobus({id_autobus: this.id_autobus, fecha_de_salida: this.viaje.fecha_de_salida}).subscribe(result =>{
      console.log(result)
      this.redondo = result
    })
  }

  comprarBoleto(){
    const name = this.registrar_boleto.get('nombre').value;
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          console.log(result.token);
          if(this.registrar_boleto.get('tipo').value == "Sencillo"){
            this.viaje.precio = this.viaje.precio - (this.viaje.precio * 0.09)
            console.log(this.viaje.precio)
          }
          this.api.hacerPago({amount:this.viaje.precio, name: this.registrar_boleto.get('nombre').value, email: this.registrar_boleto.get('correo').value, stripeToken: result.token}).subscribe(result =>{
            console.log(result)
            this.api.actualizarBoleto(this.asientoSeleccionado, {id_autobus: this.id_autobus, id_viaje: this.id_viaje, nombre: this.registrar_boleto.get('nombre').value, tipo: this.registrar_boleto.get('tipo').value, asiento: this.registrar_boleto.get('asiento').value, vendido: 1}).subscribe(result =>{
              console.log("Imprimiendo")
              console.log(result)
              this.datosDePago = result
              this.procesoPago = 1
            })
          }, error =>{
            console.log(error)
          })
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });

      this.ngOnInit()
  }

  viajeRedondo(id){
    console.log(id)
    this.id_redondo = id
    this.api.obtenerViaje(this.id_redondo).subscribe(result =>{
      console.log(result)
      this.redon = result
    })
  }

  redirigir(){
    this.ruta.navigateByUrl("/")
  }

}
