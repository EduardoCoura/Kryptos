
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // In a real app, validation logic would be more complex
  const token = localStorage.getItem('kryptos_token');

  if (token) {
    return true;
  } else {
    // Redirect to Home (Landing Page) if no token found.
    // This keeps the user on the main marketing/entry page instead of forcing a login screen.
    return router.createUrlTree(['/']);
  }
};
