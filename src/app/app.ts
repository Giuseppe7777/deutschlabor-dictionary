import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InterfaceLanguageRouteService } from './core/i18n/interface-language-route.service';
import { Header } from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('deutschlabor-dictionary');

  private readonly _interfaceLanguageRoute = inject(InterfaceLanguageRouteService);
}
