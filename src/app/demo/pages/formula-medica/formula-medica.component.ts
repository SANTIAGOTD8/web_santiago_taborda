import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormulaMedicaService, FormulaMedica } from './service/formula-medica.service';

@Component({
  selector: 'app-formula-medica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formula-medica.component.html',
  styleUrl: './formula-medica.component.scss'
})
export class FormulaMedicaComponent implements OnInit {

  registros: FormulaMedica[] = [];
  form: FormGroup;
  editando = false;
  cargando = false;
  mensajeError = '';

  constructor(
    private service: FormulaMedicaService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [null],
      mascotaId: [null, Validators.required],
      medicoId: [null, Validators.required],
      observaciones: [''],
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

  abrirModalEditar(modal: any, item: FormulaMedica): void {
    this.editando = true;
    this.mensajeError = '';
    this.form.patchValue({
      id: item.id,
      mascotaId: item.mascota?.mascotaId,
      medicoId: item.medico?.id,
      observaciones: item.observaciones,
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
