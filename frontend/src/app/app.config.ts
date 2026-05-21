import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Single provideHttpClient call with ALL options — withFetch() fixes SSR warning
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    // Single provideClientHydration call — duplicate was causing issues
    provideClientHydration(withEventReplay()),
  ],
};
