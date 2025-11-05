import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const httpLoggingInterceptor: HttpInterceptorFn = (req, next) => {
  // Log request details
  console.group(`🚀 HTTP ${req.method} ${req.url}`);
  console.log('Headers:', req.headers.keys().length > 0 ? Object.fromEntries(req.headers.keys().map(key => [key, req.headers.getAll(key)])) : 'No custom headers');
  
  if (req.body && typeof req.body === 'object' && req.body !== null) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('Request Body Keys:', Object.keys(req.body));
    console.log('Has id in body?', 'id' in req.body);
    console.log('Has userId in body?', 'userId' in req.body);
  }
  
  return next(req).pipe(
    tap({
      next: (response) => {
        console.log('✅ Response:', response);
        console.groupEnd();
      },
      error: (error) => {
        console.error('❌ Error:', error);
        if (error.error) {
          console.error('Error details:', JSON.stringify(error.error, null, 2));
        }
        console.groupEnd();
      }
    })
  );
};

