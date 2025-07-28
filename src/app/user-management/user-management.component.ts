import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { allFunctionalities } from '../sidebar/sidebar';
import { HttpClient } from '@angular/common/http';

interface StoredUser {
  username: string;
  password: string;
  role: string;
  functionalities: string[];
  active: boolean;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  @Output() onClose = new EventEmitter<void>();

  displayAddForm = false;
  editingIndex = -1;

  users: StoredUser[] = [];
  roles: string[] = [];

  allFunctionalities = allFunctionalities.map((f) => f.label);
  roleFunctionalities: string[] = [];

  newUser: StoredUser = {
    username: '',
    password: '',
    role: '',
    functionalities: [],
    active: true,
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const usersFromStorage = localStorage.getItem('appUsers');
    if (usersFromStorage) {
      const allUsers = JSON.parse(usersFromStorage);
      this.users = allUsers.filter(
        (u: any) => u.username.toLowerCase() !== 'admin'
      );
    } else {
      this.loadDefaultUsersFromJson();
    }
    this.updateRoles();
  }

  updateRoles() {
    const allUsers = JSON.parse(
      localStorage.getItem('appUsers') || '[]'
    ) as StoredUser[];
    this.roles = [...new Set(allUsers.map((u) => u.role))];
  }

  onRoleChange() {
    const roleBasedFuncs: { [key: string]: string[] } = {
      admin: [
        'Dashboard',
        'Users',
        'Settings',
        'Notifications',
        'Reports',
        'User Management',
      ],
      editor: ['Dashboard', 'Articles', 'Notifications', 'Reports'],
      viewer: ['Dashboard', 'Reports'],
      controller: ['Dashboard', 'Notifications', 'Reports'],
      media: ['Dashboard', 'Media Library', 'Upload Content'],
    };

    const selectedRole = this.newUser.role.toLowerCase();
    this.roleFunctionalities =
      roleBasedFuncs[selectedRole] || this.allFunctionalities;
    this.newUser.functionalities = [...this.roleFunctionalities];
  }

  addUser() {
    const { username, password, role, functionalities } = this.newUser;

    if (!username || !password || !role || !functionalities.length) {
      alert('Please fill in all required fields.');
      return;
    }

    const allUsers: StoredUser[] = JSON.parse(
      localStorage.getItem('appUsers') || '[]'
    );

    const isDuplicate = allUsers.some(
      (u, idx) => u.username === username && idx !== this.editingIndex
    );

    if (isDuplicate) {
      alert('Username already exists!');
      return;
    }

    if (this.editingIndex > -1) {
      allUsers[this.editingIndex] = { ...this.newUser };
    } else {
      allUsers.push({ ...this.newUser });
    }

    localStorage.setItem('appUsers', JSON.stringify(allUsers));
    this.users = allUsers;
    this.updateRoles(); // Update dropdown
    this.resetForm();
  }

  resetForm() {
    this.newUser = {
      username: '',
      password: '',
      role: '',
      functionalities: [],
      active: true,
    };
    this.roleFunctionalities = [];
    this.displayAddForm = false;
    this.editingIndex = -1;
  }

  toggleStatus(index: number) {
    const allUsers = JSON.parse(
      localStorage.getItem('appUsers') || '[]'
    ) as StoredUser[];
    allUsers[index].active = !allUsers[index].active;
    localStorage.setItem('appUsers', JSON.stringify(allUsers));
    this.users = allUsers;
  }

  editUser(index: number) {
    const user = this.users[index];
    this.newUser = {
      ...user,
      password: '', // Prevent exposing/editing old password
    };
    this.roleFunctionalities = [...user.functionalities];
    this.displayAddForm = true;
    this.editingIndex = index;
  }

  deleteUser(index: number) {
  const allUsers = JSON.parse(localStorage.getItem('appUsers') || '[]') as StoredUser[];

  if (allUsers[index].role === 'admin') {
    alert("Admin user cannot be deleted!");
    return;
  }

  allUsers.splice(index, 1);
  localStorage.setItem('appUsers', JSON.stringify(allUsers));
  this.users = allUsers;
  this.updateRoles();
}


  copyUser(index: number) {
    const user = this.users[index];
    const copy: StoredUser = {
      ...user,
      username: user.username + '_copy',
      active: true,
    };
    const allUsers = JSON.parse(
      localStorage.getItem('appUsers') || '[]'
    ) as StoredUser[];
    allUsers.push(copy);
    localStorage.setItem('appUsers', JSON.stringify(allUsers));
    this.users = allUsers;
  }

  loadDefaultUsersFromJson() {
    this.http.get<StoredUser[]>('assets/userlist.json').subscribe((data) => {
      this.users = data;
      localStorage.setItem('appUsers', JSON.stringify(data));
    });
  }

  close() {
    this.onClose.emit();
  }
}
