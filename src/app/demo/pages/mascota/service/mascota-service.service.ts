// demo/pages/mascota/service/mascota-service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface Mascota {
  mascotaId?: number;
  nombreMascota: string;
  edad: number;
  raza?: { razaId: number; nombre?: string };
  cliente?: { clienteId: number; nombres?: string };
}

export interface MascotaRq {
  mascotaId?: number;
  nombreMascota: string;
  edad: number;
  razaId: number;
  clienteId: number;
}

@Injectable({ providedIn: 'root' })
export class MascotaServiceService {

  private base = `${environment.apiUrlAuth}/mascota`;

  constructor(private http: HttpClient) { }

  listar(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.base}/listar`);
  }

  guardar(mascota: MascotaRq): Observable<any> {
    return this.http.post(`${this.base}/guardar`, mascota);
  }

  actualizar(mascota: MascotaRq): Observable<any> {
    return this.http.post(`${this.base}/actualizar`, mascota);
  }
}