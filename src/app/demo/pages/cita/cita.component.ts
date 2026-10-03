// demo/pages/cita/cita.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CitaServiceService, Cita } from './service/cita-service.service';

@Component({
  selector: 'app-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cita.component.html',
  styleUrl: './cita.component.scss'
})
export class CitaComponent implements OnInit {

  citas: Cita[] = [];
  form: FormGroup;
  editando = false;
  cargando = false;
  mensajeError = '';

  constructor(
    private citaService: CitaServiceService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [null],
      mascotaId: [null, Validators.required],
      medicoId: [null, Validators.required],
      fecha: ['', Validators.required],
      motivo: ['', Validators.required],
      observaciones: [''],
    });
  }

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando = true;
    this.citaService.listar().subscribe({
      next: (data) => { this.citas = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  abrirModalAgregar(modal: any): void {
    this.editando = false;
    this.form.reset();
    this.mensajeError = '';
    this.modalService.open(modal);
  }

  abrirModalEditar(modal: any, cita: Cita): void {
    this.editando = true;
    this.mensajeError = '';
    this.form.patchValue({
      id: cita.id,
      mascotaId: cita.mascota?.mascotaId,
      medicoId: cita.medico?.id,
      fecha: cita.fecha?.substring(0, 16),
      motivo: cita.motivo,
      observaciones: cita.observaciones,
    });
    this.modalService.open(modal);
  }

  guardar(modalRef: any): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const accion = this.editando
      ? this.citaService.actualizar(this.form.value)
      : this.citaService.guardar(this.form.value);

    accion.subscribe({
      next: () => { modalRef.close(); this.cargarCitas(); },
      error: (err) => { this.mensajeError = err?.error?.message || 'Ocurrió un error al guardar'; }
    });
  }
}