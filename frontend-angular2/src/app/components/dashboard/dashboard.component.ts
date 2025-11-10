import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, SessionInfo } from '../../services/auth.service';

interface Application {
  id: number;
  userName: string;
  status: string;
  submittedDate: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-lg shadow-xl p-8">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-800 mb-2">
                Admin Dashboard
              </h1>
              <p *ngIf="session.adminName" class="text-gray-600">
                Welcome, {{ session.adminName }}
              </p>
            </div>
            <button
              (click)="handleLogout()"
              class="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>

          <div class="mb-6">
            <h2 class="text-2xl font-semibold text-gray-700 mb-4">
              User Applications
            </h2>
            
            <div *ngIf="applications.length === 0" class="text-gray-500 text-center py-8">
              No applications found
            </div>

            <div *ngIf="applications.length > 0" class="space-y-3">
              <div
                *ngFor="let app of applications"
                (click)="viewApplication(app)"
                class="border border-gray-200 rounded-lg p-4 hover:bg-purple-50 cursor-pointer transition-colors"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="font-semibold text-gray-800">{{ app.userName }}</h3>
                    <p class="text-sm text-gray-600">Submitted: {{ app.submittedDate }}</p>
                  </div>
                  <div class="flex items-center space-x-4">
                    <span class="px-3 py-1 rounded-full text-sm font-medium"
                          [ngClass]="{
                            'bg-green-100 text-green-800': app.status === 'Active',
                            'bg-yellow-100 text-yellow-800': app.status === 'Pending',
                            'bg-gray-100 text-gray-800': app.status === 'Inactive'
                          }">
                      {{ app.status }}
                    </span>
                    <button class="text-purple-600 hover:text-purple-800 font-semibold">
                      View →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  session: SessionInfo = { authenticated: false };
  applications: Application[] = [
    {
      id: 1,
      userName: 'John Doe',
      status: 'Active',
      submittedDate: '2024-01-15'
    },
    {
      id: 2,
      userName: 'Jane Smith',
      status: 'Pending',
      submittedDate: '2024-01-20'
    },
    {
      id: 3,
      userName: 'Bob Johnson',
      status: 'Active',
      submittedDate: '2024-01-25'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.session$.subscribe(session => {
      this.session = session;
      if (!session.authenticated || session.userType !== 'Admin') {
        this.router.navigate(['/']);
      }
    });
    
    this.authService.checkSession();
  }

  viewApplication(app: Application) {
    // Navigate to Angular1 with admin context
    window.location.href = 'http://localhost:4200';
  }

  handleLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.router.navigate(['/']);
      }
    });
  }
}

