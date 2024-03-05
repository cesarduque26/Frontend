import { Component } from '@angular/core';
import { Reservacion } from "src/app/models/reservacion";
import { DatosModificacionReservaService } from 'src/app/services/datosModificacionReserva'; 
import { HotelService } from 'src/app/services/hotel.service';
import { Router } from '@angular/router'; 
import { Cliente } from "src/app/models/cliente";
import { Habitacion } from 'src/app/models/habitacion';
import { Global } from 'src/app/services/global';
import { ClienteIdReserva } from 'src/app/models/ClienteIdReserva';
import { DatosService } from 'src/app/services/datos';

@Component({
  selector: 'app-modificacion-reservas',
  templateUrl: './modificacion-reservas.component.html',
  styleUrls: ['./modificacion-reservas.component.css'],
  providers: [HotelService]
})

export class ModificacionReservasComponent {
  public Reservaciones: Reservacion[];
  public reservas:Reservacion[];
  public Habitaciones: Habitacion[];
  public Cliente: Cliente;
  public reservainfoModificacion: any[] = [];
  public url:string;
  public subtotal:number;
  public precio ;
  mensaje: string = ''; 
  public iva:number;
  public fechaCheckIn :string;
  public fechaCheckOut :string;
  public precioTotalInicial: number;
  public precioTotalModificado: number;
  public clienteIdReserva: ClienteIdReserva;

  constructor(private datosModificacionReservaService: DatosModificacionReservaService,
              private router: Router,private _hotelService: HotelService,private datosService: DatosService) 
  {
      this.Reservaciones = [];
      this.Habitaciones = [];
      this.Cliente=new Cliente('','','','','','','');
      this.reservas=[];
      this.url = Global.url;
      this.iva=0;
      this.subtotal=0;
      this.precio=0;
      this.fechaCheckIn= '';
      this.fechaCheckOut= '';
      this.precioTotalInicial =0;
      this.precioTotalModificado =0;
      this.clienteIdReserva=new ClienteIdReserva(this.Cliente,"",true,true,0);

  }
               
  ngOnInit(): void 
  {
    this.obtenerHabitaciones();
    this.procesarReservasModificacion();
    this.datosService.nuevoCliente$.subscribe(cliente => this.Cliente = cliente);

  }
  
  procesarReservasModificacion() 
  {
    console.log("Estamos en modificacion");
    this.datosModificacionReservaService.objetoDatos$.subscribe(reservas => {
      this.reservas = reservas;
      console.log("Reservas: ", this.reservas);
      this.calculartotal();
      this.precioTotalInicial=this.precio
    });
  }

  modificarReservas() 
  {
    this.enviarCorreoConIdReserva();
    this.reservas.forEach(reserva => {
        this._hotelService.updateReservacion(reserva).subscribe(
            (res) => {
                console.log("Reserva actualizada con éxito:", res);
            },
            (error) => {
                console.error("Error al actualizar la Reserva:", error);
            }
        );
    });
    alert('¡Modificación de Reserva realizada con éxito!');
    this.router.navigate(['/buscar']);
  }
 
  calculartotal(): void 
  {
    this.subtotal=0;

    for (const reserva of this.reservas) {
      this.subtotal += reserva.PrecioTotal;
      console.log(this.subtotal)
    }
    this.iva=this.subtotal*0.12;
    console.log("terminado el for",this.subtotal)
    console.log("iva",this.iva)
    this.precio=this.iva+this.subtotal;
  }

  
  obtenerHabitaciones() 
  {
    this._hotelService.getHabitaciones().subscribe(
      response => {
        this.Habitaciones = response.habitaciones;
      },
      error => {
        console.error(error);
      }
    );
  } 

  recalcularPrecio(reserva: any) 
  {
    const fechaCheckIn = new Date(reserva.FechaCheckIn);
    const fechaCheckOut = new Date(reserva.FechaCheckOut);
    const diffTime = Math.abs(fechaCheckOut.getTime() - fechaCheckIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    reserva.NumNoches = diffDays;
    let valorDesayuno = 7*diffDays;
    
    if(reserva.Desayuno)
      reserva.PrecioTotal = diffDays * reserva.PrecioPorNocheEstatico + valorDesayuno;
    else
      reserva.PrecioTotal = diffDays * reserva.PrecioPorNocheEstatico

    this.calculartotal();
  }
  
  calcularNumeroNoches(reserva: Reservacion): number 
  {
    const fechaCheckIn = new Date(reserva.FechaCheckIn);
    const fechaCheckOut = new Date(reserva.FechaCheckOut);
    const diffTime = Math.abs(fechaCheckOut.getTime() - fechaCheckIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  obtenerDatosHabitaciones(reserva: any): any 
  {
    console.log("id"+reserva.IDHabitacion);
    const habitacion = this.Habitaciones.find(hab => hab._id === reserva.IDHabitacion);
    reserva.PrecioPorNocheEstatico = habitacion?.Precio;
    return habitacion;
  }
 
  enviarCorreoConIdReserva() {
    console.log('enviarformulario');
    this.clienteIdReserva=new ClienteIdReserva(this.Cliente,this.reservas[0].IdReservacion,true,true,this.precioTotalInicial-this.precio);

    this._hotelService.enviarCorreoVerificacion(this.clienteIdReserva)
    .subscribe(
      (response: any) => {
          this.mensaje = 'Correo de modificacion de reserva enviado con exito';
          console.log(this.mensaje);
      },
      (error) => {
        console.log(error);
        this.mensaje = 'Error al enviar Correo de modif de reserva';
        console.log(this.mensaje);
      }
    );
}

}