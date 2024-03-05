import { Component, OnInit} from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { Global } from 'src/app/services/global';
import { HotelService } from 'src/app/services/hotel.service';
import { DatosService } from 'src/app/services/datos';
import { Router } from '@angular/router'; // Importa el servicio Router
import { Reservacion } from 'src/app/models/reservacion';
import { ClienteIdReserva } from 'src/app/models/ClienteIdReserva';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css','./formulario.responsive.css'],
  providers: [HotelService]
})

export class FormularioComponent implements OnInit{
  public url: string;
  public carrito: any[] = [];
  public nuevaReservacion: Reservacion[] = [];
  public nuevoCliente: Cliente;
  public clienteIdReserva: ClienteIdReserva;
  mensaje: string = ''; 
  codigoVerifica: string = ''; 

    constructor(private _hotelService: HotelService,private datosService: DatosService,private router: Router) {
      this.url = Global.url;
      this.nuevoCliente=new Cliente('','','','','','','');
      this.clienteIdReserva=new ClienteIdReserva(this.nuevoCliente,"",false);
    }

    ngOnInit(): void {
      this.datosService.carrito$.subscribe(carrito => this.carrito = carrito);
      this.datosService.nuevaReservacion$.subscribe(reservacion => this.nuevaReservacion = reservacion);
    }
     // parte del correo
     enviarformulario() {
      console.log('enviarformulario');
      this._hotelService.enviarCorreoVerificacion(this.clienteIdReserva)
      .subscribe(
        (response: any) => {
          console.log(response); 
          if (response.verificacionCodigo!= '') {
            this.mensaje = 'Correo de verificación enviado con éxito';
            console.log(this.mensaje);
            var verificar =
            this.solicitarCodigoVerificacion(response.verificacionCodigo.toString())
            if (verificar ) {
              console.log("Guardar cliente");

              this._hotelService.saveCliente(this.nuevoCliente).subscribe(
                response => {
                  console.log('Respuesta del servidor:', response);
                  console.log("antes de enviar",this.nuevoCliente);
                  this.nuevoCliente=response.cliente;
                  this.datosService.actualizarNuevoCliente(this.nuevoCliente);
                  this.router.navigate(['/pago']) });

            }else{
              console.log("No se guardo cliente");
              
            }
          } else {
            this.mensaje = 'Error al enviar el correo de verificación test imgresp';
            console.log(this.mensaje);
          }
        },
        (error) => {
          console.log(error);
          this.mensaje = 'Error al enviar el correo de verificación' + error.message.toString();
          console.log(this.mensaje);
        }
      );
   
  }
  
  //igual forma parte del correo
  solicitarCodigoVerificacion(codigo:string): boolean {
    var codigoIngresado = prompt('Ingrese codigo de verificacion');
    if(codigoIngresado != null){
      if (codigoIngresado === codigo) {
        console.log("codigo validado");
        return true;
      }else{
        
        alert('ERROR')
        return false;
      }   
    }       
    else  
      this.codigoVerifica = "0000";
    console.log(codigoIngresado);
    return false;
  }


  calcularSubtotal(): number {
    let subtotal = 0;
    for (const reserva of this.carrito) {
      subtotal += reserva.precioTotal;
    }
    return subtotal;
  }
}
