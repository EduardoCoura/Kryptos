
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      let message = 'UNKNOWN_ERROR';
      let type: 'error' | 'warning' = 'error';

      // Security Protocols
      if (error.status === 401) {
        // Unauthorized: Token invalid or expired
        message = 'ERR_SESSION_INVALID // RE-AUTHENTICATION REQUIRED';
        localStorage.removeItem('kryptos_token');
        router.navigate(['/auth/login']);
      
      } else if (error.status === 403) {
        // Forbidden: Insufficient clearance
        message = 'ACCESS_DENIED // CLEARANCE LEVEL INSUFFICIENT';
        type = 'warning';
      
      } else if (error.status === 500) {
        // Server Error
        message = 'CRITICAL_FAILURE // REMOTE SERVER ERROR';
      
      } else if (error.status === 0) {
        // Network / Offline
        message = 'UPLINK_TERMINATED // CONNECTION TO SECURE SERVER FAILED';
      } else {
        message = `ERR_CODE_${error.status} // ${error.statusText || 'UNEXPECTED_EXCEPTION'}`;
      }

      // Dispatch Notification
      toast.show(message, type);

      // Re-throw to keep the error chain alive for specific component handling if needed
      return throwError(() => error);
    })
  );
};
