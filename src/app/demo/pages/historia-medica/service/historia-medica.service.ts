import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface HistoriaMedica {
  id?: number;
  mascota?: { mascotaId: number; nombreMascota?: string };
  fechaCreacion?: string;
  observacionesGenerales?: string;
}

export interface HistoriaMedicaRq {
  id?: number;
  mascotaId: number;
  observacionesGenerales?: string;
}

@Injectable({ providedIn: 'root' })
export class HistoriaMedicaService {

  private base = `${environment.apiUrlAuth}/historia-medica`;

  constructor(private http: HttpClient) { }

  listar(): Observable<HistoriaMedica[]> {
    return this.http.get<HistoriaMedica[]>(`${this.base}/listar`);
  }

  guardar(item: HistoriaMedicaRq): Observable<any> {
    return this.http.post(`${this.base}/guardar`, item);
  }

  actualizar(item: HistoriaMedicaRq): Observable<any> {
    return this.http.post(`${this.base}/actualizar`, item);
  }
}
