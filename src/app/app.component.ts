import { Component } from '@angular/core';
import { EntrevistaComponent } from './entrevista/entrevista.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EntrevistaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}