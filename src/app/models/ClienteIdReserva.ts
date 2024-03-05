import { Cliente } from './cliente'; 
export class ClienteIdReserva{
    constructor(
        public cliente:Cliente,
        public idReserva:string,
        public esReserva:boolean,
        public esModificacionReserva:boolean,
        public diferencia:number,
    ){}
}
