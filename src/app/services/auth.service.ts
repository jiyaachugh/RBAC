import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserKey = 'currentUser';

  login(user: any) {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  getCurrentUser(): any {
    const userData = localStorage.getItem(this.currentUserKey);
    return userData ? JSON.parse(userData) : null;
  }

  logout() {
    localStorage.removeItem(this.currentUserKey);
    // Do NOT remove appUsers — they are needed for login later
  }
}
