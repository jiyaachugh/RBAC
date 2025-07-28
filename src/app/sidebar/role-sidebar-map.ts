export const ROLE_SIDEBAR_MAP: Record<string, any[]> = {
  admin: [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Users', icon: 'pi pi-users', route: '/users' },
    { label: 'Settings', icon: 'pi pi-cog', route: '/settings' },
    { label: 'Reports', icon: 'pi pi-chart-line', route: '/reports' },
    { label: 'User Management', icon: 'pi pi-user-edit', route: '/user-management' }
  ],
  viewer: [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Reports', icon: 'pi pi-chart-line', route: '/reports' }
  ],
  editor: [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Articles', icon: 'pi pi-file', route: '/articles' }
  ],
  controller: [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Notifications', icon: 'pi pi-bell', route: '/notifications' },
    { label: 'Reports', icon: 'pi pi-chart-line', route: '/reports' }
  ],
  media: [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Media Library', icon: 'pi pi-images', route: '/media' },
    { label: 'Upload Content', icon: 'pi pi-upload', route: '/upload' }
  ]
};