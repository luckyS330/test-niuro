import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, SessionInfo } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div *ngIf="session.authenticated; else notAuthenticated">
          <h1 class="text-3xl font-bold text-gray-800 mb-4 text-center">
            Welcome!
          </h1>
          
          <div *ngIf="session.adminName" class="mb-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-800 font-semibold mb-1">Admin View</p>
            <p class="text-lg text-blue-900 font-bold">{{ session.adminName }}</p>
          </div>

          <p class="text-gray-600 mb-8 text-center">
            You are successfully authenticated and viewing the Angular User Application.
          </p>

          <div class="space-y-4">
            <button
              (click)="goBack()"
              class="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              {{ session.adminName ? 'Back to App' : 'Go Back to Home' }}
            </button>
          </div>
        </div>

        <ng-template #notAuthenticated>
          <h1 class="text-3xl font-bold text-gray-800 mb-4 text-center">
            Access Denied
          </h1>
          <p class="text-gray-600 mb-8 text-center">
            You need to be authenticated to access this application.
          </p>
          <button
            (click)="goToLogin()"
            class="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Go to Login
          </button>
        </ng-template>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  session: SessionInfo = { authenticated: false };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.session$.subscribe(session => {
      this.session = session;
    });
    
    this.authService.checkSession();
  }

  goBack() {
    if (this.session.adminName) {
      // If admin, go back to Angular2
      window.location.href = 'http://localhost:4201';
    } else {
      // If regular user, go back to Next.js
      window.location.href = 'http://localhost:3000';
    }
  }

  goToLogin() {
    window.location.href = 'http://localhost:3000';
  }
}

