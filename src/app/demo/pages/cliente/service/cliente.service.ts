import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface Cliente {
  id?: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento?: string;
  genero?: string;
  telefono?: string;
  direccion?: string;
  activo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {

  private base = `${environment.apiUrlAuth}/cliente`;

  constructor(private http: HttpClient) { }

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.base}/all`);
  }

  guardar(item: Cliente): Observable<any> {
    return this.http.post(`${this.base}/guardar`, item);
  }

  actualizar(item: Cliente): Observable<any> {
    return this.http.post(`${this.base}/actualizar`, item);
  }
}
