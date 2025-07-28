import { Component, OnInit } from '@angular/core';
import { ROLE_SIDEBAR_MAP } from './role-sidebar-map';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentRole: string = '';
  currentUsername: string = '';
  allowedItems: any[] = [];

  displayUserMgmtDialog: boolean = false;
  dummyDialogVisible: boolean = false;
  dummyDialogText: string = '';

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentRole = user.role;
    this.currentUsername = user.username;

    const fullSidebar = ROLE_SIDEBAR_MAP[this.currentRole] || [];

    // ✅ Show only buttons user has access to
    this.allowedItems = fullSidebar.filter((item: any) =>
      user.functionalities.includes(item.label)
    );
  }

  navigate(route: string, label: string) {
    if (label === 'User Management' && this.currentRole === 'admin') {
      this.displayUserMgmtDialog = true;
    } else {
      // ✅ Show dummy dialog
      this.dummyDialogText = `You clicked on ${label} — this module is coming soon!`;
      this.dummyDialogVisible = true;
    }
  }

  closeUserMgmtDialog() {
    this.displayUserMgmtDialog = false;
  }

  closeDummyDialog() {
    this.dummyDialogVisible = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
