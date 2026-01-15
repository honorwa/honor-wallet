# Admin Login & User Management Guide

## Creating an Admin Account

### Method 1: Register as Admin (Manual localStorage Edit)

1. **Register a normal account** first:
   - Go to registration page
   - Register with your email/password
   - Complete email verification (if using Firebase)

2. **Become Admin via Browser Console**:
   - After registration, open browser console (F12)
   - Run this code:
   ```javascript
   // Get all users
   let users = JSON.parse(localStorage.getItem('honor_users') || '[]');

   // Find your user by email
   let myEmail = 'your.email@example.com'; // Replace with your email
   let userIndex = users.findIndex(u => u.email === myEmail);

   // Make yourself admin
   if (userIndex !== -1) {
     users[userIndex].role = 'admin';
     localStorage.setItem('honor_users', JSON.stringify(users));

     // Update current user too
     let currentUser = JSON.parse(localStorage.getItem('honor_current_user'));
     if (currentUser && currentUser.email === myEmail) {
       currentUser.role = 'admin';
       localStorage.setItem('honor_current_user', JSON.stringify(currentUser));
     }

     console.log('You are now an admin!');
     location.reload(); // Reload to see admin menu
   } else {
     console.log('User not found');
   }
   ```

3. **Refresh the page** - You'll now see the Admin menu in the sidebar!

### Method 2: Default Admin Account (Quick Test)

For testing, you can create a default admin:

1. Open browser console (F12)
2. Run:
```javascript
const adminUser = {
  id: 'admin-001',
  full_name: 'Admin User',
  email: 'admin@honor.com',
  password: 'admin123',
  role: 'admin',
  kyc_status: 'verified',
  status: 'active',
  verified: true,
  email_verified: true,
  join_date: new Date().toISOString()
};

// Add to users list
let users = JSON.parse(localStorage.getItem('honor_users') || '[]');
if (!users.find(u => u.email === 'admin@honor.com')) {
  users.push(adminUser);
  localStorage.setItem('honor_users', JSON.stringify(users));
  console.log('Admin account created!');
  console.log('Email: admin@honor.com');
  console.log('Password: admin123');
}
```

3. **Login with**:
   - Email: `admin@honor.com`
   - Password: `admin123`

---

## Admin Features

Once logged in as admin, you'll see these additional menu items:

### 1. **Admin Console** (Admin Dashboard)
- View platform statistics
- Monitor total assets
- See active users count
- Track pending KYC requests
- View open support tickets

### 2. **Member List** (Admin Users)
- View all registered users
- See user details (email, join date, KYC status, account status)
- **Manage users:**
  - Verify/Reject KYC requests
  - Suspend/Activate accounts
  - Put accounts on hold
  - Set custom fee percentages per user

### 3. **Admin Support** (Hidden for now)
- View all support tickets
- Respond to user inquiries
- Close tickets

---

## Managing Users as Admin

### View All Users
1. Click **"Member List"** in sidebar
2. You'll see a table with all registered users

### Make Someone Admin
1. Open browser console
2. Run:
```javascript
function makeAdmin(userEmail) {
  let users = JSON.parse(localStorage.getItem('honor_users') || '[]');
  let user = users.find(u => u.email === userEmail);

  if (user) {
    user.role = 'admin';
    localStorage.setItem('honor_users', JSON.stringify(users));
    console.log(`${userEmail} is now an admin!`);
    location.reload();
  } else {
    console.log('User not found');
  }
}

// Usage:
makeAdmin('user@example.com');
```

### Approve KYC Request
1. Go to **Admin Console**
2. Scroll to "KYC Requests" section
3. Click **"Verify"** to approve
4. Or click **"Reject"** to deny

### Suspend a User
1. Go to **Member List**
2. Find the user
3. Click **"Edit User"** (pencil icon)
4. Change status to **"Suspended"**
5. Save

### Set Custom Fees per User
1. Go to **Member List**
2. Click **"Edit User"**
3. Set **"Fee Percentage"** (e.g., 0.5 for 0.5%)
4. Save

---

## Admin vs Regular User Differences

| Feature | Regular User | Admin |
|---------|-------------|-------|
| Dashboard | ✅ | ✅ |
| Portfolio | ✅ | ✅ |
| Send/Convert | ✅ | ✅ |
| AI Advisor | ✅ | ✅ |
| Support | ✅ | ✅ |
| Admin Console | ❌ | ✅ |
| Member List | ❌ | ✅ |
| Admin Support | ❌ | ✅ |
| View All Users | ❌ | ✅ |
| Manage KYC | ❌ | ✅ |
| Suspend Users | ❌ | ✅ |

---

## User Roles in Database

The system recognizes 2 roles:

```typescript
role: 'user' | 'admin'
```

### Regular User:
```json
{
  "id": "user-123",
  "full_name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "kyc_status": "none",
  "status": "active"
}
```

### Admin User:
```json
{
  "id": "admin-001",
  "full_name": "Admin User",
  "email": "admin@honor.com",
  "role": "admin",
  "kyc_status": "verified",
  "status": "active"
}
```

---

## Testing Admin Features

### Create Multiple Test Users

Run in console:
```javascript
function createTestUsers() {
  const testUsers = [
    {
      id: 'user-001',
      full_name: 'Alice Smith',
      email: 'alice@test.com',
      password: 'test123',
      role: 'user',
      kyc_status: 'pending',
      status: 'active',
      verified: true,
      email_verified: true,
      join_date: new Date().toISOString()
    },
    {
      id: 'user-002',
      full_name: 'Bob Johnson',
      email: 'bob@test.com',
      password: 'test123',
      role: 'user',
      kyc_status: 'verified',
      status: 'active',
      verified: true,
      email_verified: true,
      join_date: new Date().toISOString()
    },
    {
      id: 'user-003',
      full_name: 'Charlie Brown',
      email: 'charlie@test.com',
      password: 'test123',
      role: 'user',
      kyc_status: 'none',
      status: 'suspended',
      verified: false,
      email_verified: false,
      join_date: new Date().toISOString()
    }
  ];

  let users = JSON.parse(localStorage.getItem('honor_users') || '[]');

  testUsers.forEach(user => {
    if (!users.find(u => u.email === user.email)) {
      users.push(user);
    }
  });

  localStorage.setItem('honor_users', JSON.stringify(users));
  console.log('Test users created!');
  location.reload();
}

createTestUsers();
```

---

## Troubleshooting

### "I don't see Admin menu"
- Make sure your user's `role` is set to `'admin'`
- Check localStorage: `localStorage.getItem('honor_current_user')`
- Refresh the page after making changes

### "Changes don't save"
- Admin changes are saved to localStorage
- Once you implement Firebase, they'll sync to cloud
- Clear cache if needed

### "How to remove admin access"
Same as making admin, but set `role: 'user'` instead

---

## Security Notes

**Important for Production:**

1. **Never expose admin creation in production** - The methods above are for development/testing only
2. **Implement proper admin creation** through:
   - Server-side API endpoint
   - Firebase Cloud Functions
   - Secure admin registration flow
3. **Add admin authentication** - Extra verification for admin actions
4. **Log admin actions** - Track what admins do for security
5. **Implement role-based access control (RBAC)** in your backend

---

## Quick Commands Reference

```javascript
// Make someone admin
let users = JSON.parse(localStorage.getItem('honor_users'));
users.find(u => u.email === 'user@email.com').role = 'admin';
localStorage.setItem('honor_users', JSON.stringify(users));

// Remove admin
users.find(u => u.email === 'admin@email.com').role = 'user';
localStorage.setItem('honor_users', JSON.stringify(users));

// View all admins
let users = JSON.parse(localStorage.getItem('honor_users'));
users.filter(u => u.role === 'admin');

// Count users
users.length;

// Delete all users (CAREFUL!)
localStorage.removeItem('honor_users');
localStorage.removeItem('honor_current_user');
```

---

**Ready to manage your platform! Login as admin to access all administrative features.**
