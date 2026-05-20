import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntrevistaService {

  private apiUrl = 'https://entrevistaia.onrender.com/api/entrevista';

  constructor(private http: HttpClient) {}

  crearSesion(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/sesion', data);
  }

  generarPregunta(data: any): Observable<string> {
    return this.http.post(this.apiUrl + '/pregunta', data, { responseType: 'text' });
  }

  evaluarRespuesta(data: any): Observable<string> {
    return this.http.post(this.apiUrl + '/evaluar', data, { responseType: 'text' });
  }

  obtenerHistorial(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/historial');
  }
}