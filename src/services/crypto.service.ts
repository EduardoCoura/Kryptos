
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export interface CryptoResult {
  data: string;
  metadata?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  // Simulate network latency or heavy computation
  private readonly SIMULATED_DELAY = 600;

  /**
   * MOCK IMPLEMENTATION
   * In a real scenario, this would inject HttpClient to call a Java Backend
   * or use window.crypto.subtle for client-side AES-GCM encryption.
   */
  
  encryptText(content: string, secretKey: string): Observable<CryptoResult> {
    // MOCK: Simple Base64 encoding + dummy hash
    const mockEncrypted = btoa(unescape(encodeURIComponent(content))); 
    const hash = this.simpleHash(secretKey);
    
    return of({
      data: `ENC_V1$${hash}$${mockEncrypted}`,
      metadata: { method: 'AES-256-GCM (Mock)', timestamp: new Date() }
    }).pipe(delay(this.SIMULATED_DELAY));
  }

  decryptText(cipherText: string, secretKey: string): Observable<CryptoResult> {
    // MOCK: Reverse the Base64
    try {
      const parts = cipherText.split('$');
      if (parts.length < 3) throw new Error('Invalid format');
      
      const content = decodeURIComponent(escape(atob(parts[2])));
      return of({
        data: content,
        metadata: { verified: true }
      }).pipe(delay(this.SIMULATED_DELAY));
    } catch (e) {
      return of({
        data: 'Error: Invalid Cipher or Key',
        metadata: { error: true }
      }).pipe(delay(this.SIMULATED_DELAY));
    }
  }

  encryptFile(file: File, secretKey: string): Observable<CryptoResult> {
    // MOCK: Return file info pretending it's encrypted
    return of({
      data: `FILE_ENC_BLOB_${file.name}_${file.size}_BYTES`,
      metadata: { originalName: file.name }
    }).pipe(delay(this.SIMULATED_DELAY + 1000)); // Files take longer
  }

  // Helper for mock visualization
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}
