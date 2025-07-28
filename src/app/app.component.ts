import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  selectedUsername: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const existingUsers = localStorage.getItem('appUsers');

    if (!existingUsers) {
      this.http.get<any[]>('assets/userlist.json').subscribe((data) => {
        localStorage.setItem('appUsers', JSON.stringify(data));
        this.users = data;
        console.log('✔️ Default user data loaded from JSON');
      });
    } else {
      this.users = JSON.parse(existingUsers);
    }

    // 🚫 Prevent looping back to login after successful login
    const loggedInUser = localStorage.getItem('username');
    const currentRoute = this.router.url;

    if (!loggedInUser && currentRoute !== '/login') {
      this.router.navigate(['/login']);
    }

    // ✅ If already logged in, go to dashboard
    if (loggedInUser && currentRoute === '/login') {
      this.router.navigate(['/dashboard']);
    }
  }

  onUsersUpdate(updatedUsers: any[]) {
    this.users = updatedUsers;
  }

  onUserLogin(username: string) {
    this.selectedUser = this.users.find(u => u.username === username);
  }
}
