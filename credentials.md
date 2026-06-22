# Project Login Credentials

Below are the administrative and staff login credentials created for testing and managing the **Aura Nails** booking system.

| Role | Username | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `AuraSuperAdmin` | `superadmin@auranails.com` | `SuperAdminPassword123` | Full access, read/write, user account management, delete bookings |
| **Admin** | `AuraAdmin` | `admin@auranails.com` | `aagam123` | Read/write access, modify booking status, manage catalog |
| **Staff** | `AuraStaff` | `staff@auranails.com` | `StaffPassword123` | Read-only access to dashboard statistics and appointments |

---

## Developer Operations

### 1. Database Seed
To reset and seed the database using MongoDB schemas (requires active MongoDB Atlas connection):
```bash
npm run seed
```

### 2. Database Migration
To migrate your local fallback data (`db.json`) to your MongoDB Atlas cluster:
```bash
npm run migrate
```
