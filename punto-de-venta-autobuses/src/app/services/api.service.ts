import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  api: string = 'http://localhost:3333'

  apiPagos: string = 'https://api-autobuses.herokuapp.com'
  constructor(private http: HttpClient) { }

  obtenerBoletosVendidos(id:any){
    return this.http.post(`${this.api}/api/boletosVendidos`, id)
  }

  obtenerViajePorAutobus(id:any){
    return this.http.post(`${this.api}/api/viajesPorAutobus`, id)
  }

  obtenerAutobus(id:any){
    return this.http.get(`${this.api}/api/autobuses/${id}`)
  }

  obtenerViaje(id:any){
    return this.http.get(`${this.api}/api/viajes/${id}`)
  }

  crearCiudad(data:any){
    return this.http.post(`${this.api}/api/ciudades`, data)
  }

  getAutobuses(){
    return this.http.get(`${this.api}/api/autobuses`)
  }

  getCiudades(){
    return this.http.get(`${this.api}/api/ciudades`)
  }

  getViajesTodos(){
    return this.http.get(`${this.api}/api/viajes`)
  }

  registrarAutobus(data:any){
    return this.http.post(`${this.api}/api/autobuses`, data)
  }

  registrarViaje(data:any){
    return this.http.post(`${this.api}/api/viajes`, data)
  }

  hacerPago(data:any){
    return this.http.post(`${this.apiPagos}/charge`, data)
  }

  getIdCiudad(data:any){
    return this.http.post(`${this.api}/api/getCiudad`, data)
  }

  getViajes(data:any){
    return this.http.post(`${this.api}/api/viajeSalida`, data)
  }

  getBoletos(data:any){
    return this.http.post(`${this.api}/api/getBoletos`, data)
  }

  crearBoleto(data:any){
    return this.http.post(`${this.api}/api/boletos`, data)
  }

  actualizarViaje(id:any, data:any){
    return this.http.put(`${this.api}/api/viajes/${id}`, data)
  }

  actualizarBoleto(id:any, data:any){
    return this.http.put(`${this.api}/api/boletos/${id}`, data)
  }

  actualizarAutobus(id:any, data:any){
    return this.http.put(`${this.api}/api/autobuses/${id}`, data)
  }

  eliminarViaje(id:any){
    return this.http.delete(`${this.api}/api/viajes/${id}`)
  }

}
