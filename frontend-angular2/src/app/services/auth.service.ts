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

export interface LoginResponse {
  success: boolean;
  message: string;
  adminName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionSubject = new BehaviorSubject<SessionInfo>({ authenticated: false });
  public session$ = this.sessionSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/login/admin`, {
      email,
      password
    }, {
      withCredentials: true
    });
  }

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

  logout(): Observable<any> {
    return this.http.post(`${API_URL}/logout`, {}, {
      withCredentials: true
    });
  }
}

