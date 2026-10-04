import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface FormulaMedica {
  id?: number;
  mascota?: { mascotaId: number; nombreMascota?: string };
  medico?: { id: number; nombres?: string };
  fechaCreacion?: string;
  observaciones?: string;
}

export interface FormulaMedicaRq {
  id?: number;
  mascotaId: number;
  medicoId: number;
  observaciones?: string;
}

@Injectable({ providedIn: 'root' })
export class FormulaMedicaService {

  private base = `${environment.apiUrlAuth}/formula-medica`;

  constructor(private http: HttpClient) { }

  listar(): Observable<FormulaMedica[]> {
    return this.http.get<FormulaMedica[]>(`${this.base}/listar`);
  }

  guardar(item: FormulaMedicaRq): Observable<any> {
    return this.http.post(`${this.base}/guardar`, item);
  }

  actualizar(item: FormulaMedicaRq): Observable<any> {
    return this.http.post(`${this.base}/actualizar`, item);
  }
}
