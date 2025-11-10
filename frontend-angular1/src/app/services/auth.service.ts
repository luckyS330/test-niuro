import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

const API_URL = 'http://localhost:5000/api/auth';

export interface SessionInfo {
  authenticated: boolean;
  userName?: string;
  userType?: string;
  adminName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionSubject = new BehaviorSubject<SessionInfo>({ authenticated: false });
  public session$ = this.sessionSubject.asObservable();

  constructor(private http: HttpClient) {}

  checkSession(): Observable<SessionInfo> {
    const obs = this.http.get<SessionInfo>(`${API_URL}/session`, {
      withCredentials: true
    });
    
    obs.subscribe({
      next: (session) => {
        this.sessionSubject.next(session);
      },
      error: (err) => {
        console.error('Session check failed:', err);
        this.sessionSubject.next({ authenticated: false });
      }
    });

    return obs;
  }

  getCurrentSession(): SessionInfo {
    return this.sessionSubject.value;
  }
}

