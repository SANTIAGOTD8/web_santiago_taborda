import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HistoriaMedicaService, HistoriaMedica } from './service/historia-medica.service';

@Component({
  selector: 'app-historia-medica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './historia-medica.component.html',
  styleUrl: './historia-medica.component.scss'
})
export class HistoriaMedicaComponent implements OnInit {

  registros: HistoriaMedica[] = [];
  form: FormGroup;
  editando = false;
  cargando = false;
  mensajeError = '';

  constructor(
    private service: HistoriaMedicaService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [null],
      mascotaId: [null, Validators.required],
      observacionesGenerales: [''],
    });
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.service.listar().subscribe({
      next: (data) => { this.registros = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  abrirModalAgregar(modal: any): void {
    this.editando = false;
    this.form.reset();
    this.mensajeError = '';
    this.modalService.open(modal);
  }

  abrirModalEditar(modal: any, item: HistoriaMedica): void {
    this.editando = true;
    this.mensajeError = '';
    this.form.patchValue({
      id: item.id,
      mascotaId: item.mascota?.mascotaId,
      observacionesGenerales: item.observacionesGenerales,
    });
    this.modalService.open(modal);
  }

  guardar(modalRef: any): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const accion = this.editando
      ? this.service.actualizar(this.form.value)
      : this.service.guardar(this.form.value);

    accion.subscribe({
      next: () => { modalRef.close(); this.cargar(); },
      error: (err) => { this.mensajeError = err?.error?.message || 'Ocurrió un error al guardar'; }
    });
  }
}
