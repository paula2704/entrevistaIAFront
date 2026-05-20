import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntrevistaService } from '../entrevista.service';

@Component({
  selector: 'app-entrevista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrevista.component.html',
  styleUrl: './entrevista.component.scss'
})
export class EntrevistaComponent {

  roles = ['Backend', 'Frontend', 'Fullstack', 'DevOps'];
  niveles = ['Junior', 'Mid', 'Senior'];
  cantidades = [1, 2, 3, 4, 5];
  temasDisponibles: { [key: string]: string[] } = {
    'Backend': ['APIs REST', 'Bases de datos', 'Seguridad', 'Microservicios', 'Caché', 'Mensajería', 'Patrones de diseño', 'Testing'],
    'Frontend': ['HTML/CSS', 'JavaScript', 'Angular', 'React', 'Performance', 'Accesibilidad', 'Testing', 'State Management'],
    'Fullstack': ['APIs REST', 'Angular', 'React', 'Bases de datos', 'Autenticación', 'Deploy', 'Testing', 'Git'],
    'DevOps': ['Docker', 'Kubernetes', 'CI/CD', 'Cloud AWS', 'Monitoreo', 'Seguridad', 'Infraestructura', 'Scripting']
  };

  rolSeleccionado = '';
  nivelSeleccionado = '';
  cantidadPreguntas = 3;
  temasSeleccionados: string[] = [];
  sesionId: number | null = null;

  preguntaActual = '';
  respuestaActual = '';
  indicePregunta = 0;

  sesion: { pregunta: string; respuesta: string; feedback: string }[] = [];

  cargando = false;
  etapa: 'configuracion' | 'pregunta' | 'resultados' = 'configuracion';

  constructor(private entrevistaService: EntrevistaService) {}

  getTemas(): string[] {
    return this.temasDisponibles[this.rolSeleccionado] || [];
  }

  toggleTema(tema: string) {
    const index = this.temasSeleccionados.indexOf(tema);
    if (index > -1) {
      this.temasSeleccionados.splice(index, 1);
    } else if (this.temasSeleccionados.length < 5) {
      this.temasSeleccionados.push(tema);
    }
  }

  temaSeleccionado(tema: string): boolean {
    return this.temasSeleccionados.includes(tema);
  }

  onRolChange() {
    this.temasSeleccionados = [];
  }

  puedeIniciar(): boolean {
    return !!this.rolSeleccionado && !!this.nivelSeleccionado && this.temasSeleccionados.length > 0;
  }

  iniciarEntrevista() {
    this.cargando = true;
    this.sesion = [];
    this.indicePregunta = 0;
    this.etapa = 'pregunta';

    const data = {
      rol: this.rolSeleccionado,
      nivel: this.nivelSeleccionado,
      temas: this.temasSeleccionados
    };

    this.entrevistaService.crearSesion(data).subscribe({
      next: (sesionCreada) => {
        this.sesionId = sesionCreada.id;
        this.cargarPregunta();
      },
      error: () => {
        this.cargarPregunta();
      }
    });
  }

  cargarPregunta() {
    this.cargando = true;
    this.respuestaActual = '';
    const data = {
      rol: this.rolSeleccionado,
      nivel: this.nivelSeleccionado,
      temas: this.temasSeleccionados
    };
    this.entrevistaService.generarPregunta(data).subscribe({
      next: (pregunta) => {
        this.preguntaActual = pregunta;
        this.cargando = false;
      },
      error: () => {
        this.preguntaActual = 'Error al generar la pregunta';
        this.cargando = false;
      }
    });
  }

  enviarRespuesta() {
    this.cargando = true;
    const data = {
      rol: this.rolSeleccionado,
      nivel: this.nivelSeleccionado,
      temas: this.temasSeleccionados,
      pregunta: this.preguntaActual,
      respuestaUsuario: this.respuestaActual,
      sesionId: this.sesionId
    };
    this.entrevistaService.evaluarRespuesta(data).subscribe({
      next: (feedback) => {
        this.sesion.push({
          pregunta: this.preguntaActual,
          respuesta: this.respuestaActual,
          feedback: feedback
        });
        this.indicePregunta++;
        if (this.indicePregunta < this.cantidadPreguntas) {
          this.cargarPregunta();
        } else {
          this.etapa = 'resultados';
          this.cargando = false;
        }
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  reiniciar() {
    this.etapa = 'configuracion';
    this.preguntaActual = '';
    this.respuestaActual = '';
    this.sesion = [];
    this.indicePregunta = 0;
    this.temasSeleccionados = [];
    this.sesionId = null;
  }
}