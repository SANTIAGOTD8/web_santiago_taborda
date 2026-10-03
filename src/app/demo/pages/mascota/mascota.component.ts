// demo/pages/mascota/mascota.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MascotaServiceService, Mascota } from './service/mascota-service.service';

@Component({
  selector: 'app-mascota',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mascota.component.html',
  styleUrl: './mascota.component.scss'
})
export class MascotaComponent implements OnInit {

  mascotas: Mascota[] = [];
  form: FormGroup;
  editando = false;
  cargando = false;
  mensajeError = '';

  constructor(
    private mascotaService: MascotaServiceService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      mascotaId: [null],
      nombreMascota: ['', Validators.required],
      edad: [null, [Validators.required, Validators.min(0)]],
      razaId: [null, Validators.required],
      clienteId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.cargando = true;
    this.mascotaService.listar().subscribe({
      next: (data) => { this.mascotas = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  abrirModalAgregar(modal: any): void {
    this.editando = false;
    this.form.reset();
    this.mensajeError = '';
    this.modalService.open(modal);
  }

  abrirModalEditar(modal: any, mascota: Mascota): void {
    this.editando = true;
    this.mensajeError = '';
    this.form.patchValue({
      mascotaId: mascota.mascotaId,
      nombreMascota: mascota.nombreMascota,
      edad: mascota.edad,
      razaId: mascota.raza?.razaId,
      clienteId: mascota.cliente?.clienteId,
    });
    this.modalService.open(modal);
  }

  guardar(modalRef: any): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const accion = this.editando
      ? this.mascotaService.actualizar(this.form.value)
      : this.mascotaService.guardar(this.form.value);

    accion.subscribe({
      next: () => {
        modalRef.close();
        this.cargarMascotas();
      },
      error: (err) => {
        this.mensajeError = err?.error?.message || 'Ocurrió un error al guardar';
      }
    });
  }
}