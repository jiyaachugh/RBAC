import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  usernames: { label: string; value: string }[] = [];
  selectedUser: string = '';
  enteredPassword: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const defaultAdmin = {
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      functionalities: ['Dashboard', 'Users', 'Settings', 'Reports', 'User Management'],
      active: true
    };

    let users = JSON.parse(localStorage.getItem('appUsers') || '[]');

    const adminExists = users.some((u: any) => u.username === 'admin' && u.role === 'admin');
    if (!adminExists) {
      users.unshift(defaultAdmin);
      localStorage.setItem('appUsers', JSON.stringify(users));
    }

    this.usernames = users
      .filter((u: any) => u.active)
      .map((u: any) => ({ label: u.username, value: u.username }));
  }

  login() {
    if (!this.selectedUser || !this.enteredPassword) {
      this.messageService.add({ severity: 'warn', summary: 'Missing Info', detail: 'Please select a username and enter password.' });
      return;
    }

    const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
    const user = users.find((u: any) => u.username === this.selectedUser && u.active);

    if (!user) {
      this.messageService.add({ severity: 'error', summary: 'Invalid User', detail: 'User not found or inactive.' });
      return;
    }

    if (user.password !== this.enteredPassword) {
      this.messageService.add({ severity: 'error', summary: 'Wrong Password', detail: 'Incorrect password.' });
      return;
    }

    this.auth.login(user);
    this.router.navigate(['/dashboard']);
  }
}
