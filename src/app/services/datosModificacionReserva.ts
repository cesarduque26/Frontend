import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Reservacion } from '../models/reservacion';

@Injectable({
  providedIn: 'root'
})

export class DatosModificacionReservaService {
  private objetoDatosSource = new BehaviorSubject<Reservacion[]>([]); // Inicializamos con un arreglo vacío de Reservacion
  objetoDatos$ = this.objetoDatosSource.asObservable();

  constructor() { }

  enviarDatosActualizar(objetoDatos: Reservacion[]) {
    this.objetoDatosSource.next(objetoDatos);
  }
  
}
