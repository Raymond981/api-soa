import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  registrar_autobus:FormGroup
  registrar_boleto: FormGroup
  registrar_viaje: FormGroup

  registrar_todo_boleto: FormGroup

  clases:any = ['Premier', 'Lite', 'Estandar']

  lista_autobuses: any = []
  lista_viajes: any = []
  lista_ciudades: any = []

  bus:any

  viajeObtenido: any

  autobusObtenido: any

  ocultarDiv:any = 0

  ocultarDivBoleto: any = 0

  boletosVendidos: any

  viajeVendido: any

  boletos:any

  boletosAutobus: any
  constructor(private api: ApiService, private formBuilder: FormBuilder) {
    this.registrar_autobus = this.formBuilder.group({
      "clase": ["", Validators.required],
      "precio_base": ["", Validators.required],
      "num_asientos": ["", Validators.required]
    })

    this.registrar_boleto = this.formBuilder.group({
      'ciudad': [''],
    })

    this.registrar_viaje = this.formBuilder.group({
      'id_autobus':[''],
      'id_origen': [''],
      'id_destino': [''],
      'distancia': [''],
      'precio': [''],
      'fecha_de_salida': [''],
      'hora_de_salida': ['']
    })

    this.registrar_todo_boleto = this.formBuilder.group({
      'id_autobus':[''],
      'id_viaje': [''],
      'asiento': ['']
    })

   }

  ngOnInit() {
    this.api.getCiudades().subscribe(result =>{
      console.log(result)
      this.lista_ciudades = result
    })

    this.api.getAutobuses().subscribe(result =>{
      console.log(result)
      this.lista_autobuses = result
    })

    this.api.getViajesTodos().subscribe(result =>{
      console.log(result)
      this.lista_viajes = result
    })
  }

  registrarAutobus(){
    console.log(this.registrar_autobus.value)
    this.api.registrarAutobus({clase: this.registrar_autobus.get('clase').value, precio_base: this.registrar_autobus.get('precio_base').value, num_asientos: this.registrar_autobus.get('num_asientos').value}).subscribe(result =>{
      console.log(result)
      this.ngOnInit()
    })
  }

  registrarBoleto(){
    console.log(this.registrar_boleto.value)
    this.api.crearCiudad(this.registrar_boleto.value).subscribe(result =>{
      console.log(result)
      this.ngOnInit()
    })
  }


  hacerBoletos(id:any){
    this.api.obtenerViaje(id).subscribe(result =>{
      this.viajeObtenido = result
      for (let index = 1; index <= 20; index++) {
        this.registrar_todo_boleto.patchValue({id_autobus: this.viajeObtenido.id_autobus, id_viaje: this.viajeObtenido.id, asiento: index})
        console.log(this.registrar_todo_boleto.value)
        this.api.crearBoleto(this.registrar_todo_boleto.value).subscribe(result =>{
          console.log(result)
        })
        
      }
      this.viajeObtenido.boletosGenerados = 1

      this.api.actualizarViaje(this.viajeObtenido.id, this.viajeObtenido).subscribe(result =>{
        console.log(result)
        this.ngOnInit()
      })
    })
  }

  hacerMantenimiento(id:any){
    this.api.obtenerAutobus(id).subscribe(result =>{
      this.autobusObtenido = result
      if(this.autobusObtenido.mantenimiento == 0){
        this.autobusObtenido.mantenimiento = 1
      }else{
        this.autobusObtenido.mantenimiento = 0
      }
  
      this.api.actualizarAutobus(id, this.autobusObtenido).subscribe(result =>{
        console.log(result)
        this.ngOnInit()
      })
    })
  }

  registrarViaje(){
    this.api.obtenerAutobus(this.registrar_viaje.get('id_autobus').value).subscribe(result =>{
      console.log(result)
      this.bus = result
      this.registrar_viaje.patchValue({precio: this.bus.precio_base*this.registrar_viaje.get('distancia').value})
      console.log(this.registrar_viaje.value)
      this.api.registrarViaje(this.registrar_viaje.value).subscribe(result =>{
        console.log(result)
        this.bus.ocupado = 1
        this.api.actualizarAutobus(this.registrar_viaje.get('id_autobus').value, this.bus).subscribe(result =>{
          console.log(result)
          this.ngOnInit()
        })
      })

    })
  }

  cerrar(){
    this.ocultarDiv = 0
  }

  obtenerBoletosVendidos(id){
    this.ocultarDiv = 1
    this.api.obtenerBoletosVendidos({id_autobus: id}).subscribe(result =>{
      console.log(result)
      this.boletosVendidos = result
      this.api.obtenerViaje(this.boletosVendidos.id_viaje).subscribe(result =>{
        this.viajeVendido = result
      })
    })
  }

  obtenerTodoBoleto(id, id_viaje){
    this.ocultarDivBoleto = 1
    this.api.getBoletos({id_autobus: id, id_viaje: id_viaje}).subscribe(result =>{
      console.log(result)
      this.boletosAutobus = result
    })
  }

  eliViaje(id:any, id_autobus:any){
    console.log(id, id_autobus)
    this.api.obtenerAutobus(id_autobus).subscribe(result =>{
      console.log(result)
      this.bus = result
      this.api.eliminarViaje(id).subscribe(result =>{
        console.log(result)
        this.bus.ocupado = 0
        this.api.actualizarAutobus(id_autobus, this.bus).subscribe(result =>{
          console.log(result)
          this.ngOnInit()
        })
      },error =>{
        console.log(error)
      })
    })
  }

}
