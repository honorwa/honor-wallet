# Admin Accounts Setup Guide

## Pre-configured Admin Accounts

The following admin accounts need to be manually created through Firebase Authentication and then their roles updated in the application:

### 1. Super Admin Account
**Email:** albertbouvier646@gmail.com
**Password:** Bouvier5526
**Role:** super_admin
**Permissions:** Can create/remove other admins, full system access

### 2. Admin Account #1
**Email:** m.dubois5789@gmail.com
**Password:** Dubois5526
**Role:** admin
**Permissions:** Full admin access except managing other admins

### 3. Admin Account #2
**Email:** info@honor-wallet.com
**Password:** Honor5526
**Role:** admin
**Permissions:** Full admin access except managing other admins

---

## Setup Instructions

### Step 1: Create Accounts in Firebase Console

1. Open Firebase Console: https://console.firebase.google.com/
2. Select your Honor Wallet project
3. Navigate to **Authentication** → **Users**
4. Click **Add user** for each account:
   - Enter the email address
   - Enter the password
   - Click **Add user**

**Repeat for all 3 accounts above.**

---

### Step 2: Log in and Update Roles

Since the registration system now creates users with `status: 'on_hold'` and `role: 'user'` by default, you need to manually promote these accounts:

#### Option A: Using Browser Console (Recommended)

1. Register/Login with the Super Admin account (albertbouvier646@gmail.com)
2. Open Browser DevTools (F12)
3. Go to **Console** tab
4. Run the following commands:

```javascript
// Get current users from localStorage
let users = JSON.parse(localStorage.getItem('honor_users') || '[]');

// Find and update Super Admin
let superAdmin = users.find(u => u.email === 'albertbouvier646@gmail.com');
if (superAdmin) {
  superAdmin.role = 'super_admin';
  superAdmin.status = 'active';
  superAdmin.buy_access = true;
}

// Find and update Admin #1
let admin1 = users.find(u => u.email === 'm.dubois5789@gmail.com');
if (admin1) {
  admin1.role = 'admin';
  admin1.status = 'active';
  admin1.buy_access = true;
}

// Find and update Admin #2
let admin2 = users.find(u => u.email === 'info@honor-wallet.com');
if (admin2) {
  admin2.role = 'admin';
  admin2.status = 'active';
  admin2.buy_access = true;
}

// Save back to localStorage
localStorage.setItem('honor_users', JSON.stringify(users));

// Update current user if it's one of the admins
let currentUser = JSON.parse(localStorage.getItem('honor_current_user') || '{}');
if (currentUser.email === 'albertbouvier646@gmail.com') {
  currentUser.role = 'super_admin';
  currentUser.status = 'active';
  currentUser.buy_access = true;
  localStorage.setItem('honor_current_user', JSON.stringify(currentUser));
}

// Reload page to apply changes
location.reload();
```

#### Option B: Manual Update via Admin Panel

1. Log in as any existing admin (if you have one)
2. Navigate to **Admin Console** → **Member List**
3. Find each admin account and click **Edit**
4. Update:
   - **Account Status:** Active
   - **Role:** super_admin (for albertbouvier646@gmail.com) or admin (for others)
   - **Buy Crypto Access:** Enabled
5. Click **Save Changes**

---

## Role Hierarchy & Permissions

### Super Admin (super_admin)
- **Full System Access**
- Can create new admins
- Can remove existing admins
- Can change user roles
- Can approve/reject accounts
- Can grant/revoke buy access
- Has access to Buy Crypto page
- Can edit user balances
- Can manage all features

### Admin (admin)
- **Almost Full Access**
- **CANNOT** create/remove other admins
- **CANNOT** change user roles (this field is hidden from them)
- Can approve/reject accounts
- Can grant/revoke buy access
- Has access to Buy Crypto page
- Can edit user balances
- Can manage support tickets
- Can view analytics

### User (user)
- Standard user access
- Can use wallet features
- Can access Convert & Send
- Buy page access depends on `buy_access` flag
- Subject to account approval (status must be 'active')

---

## Important Notes

### 1. New User Flow
- All new registrations are created with `status: 'on_hold'`
- Users with 'on_hold' status **cannot**:
  - Send crypto
  - Convert crypto
  - Buy crypto (even if they have buy_access)
  - Perform any transactions
- An admin must manually approve accounts by changing status to 'active'

### 2. Buy Page Access
- The Buy Crypto page is **hidden by default**
- Only visible to:
  - All admins (admin & super_admin)
  - Regular users with `buy_access: true`
- Admins can grant buy access to specific users via the Edit User dialog

### 3. Security
- Super Admin role should be granted to **trusted individuals only**
- Only Super Admins can promote users to admin status
- Regular admins cannot escalate their own privileges

---

## Verification Checklist

After setup, verify:

- [ ] All 3 admin accounts can log in
- [ ] Super Admin sees "Super Admin" role badge (purple)
- [ ] Regular admins see "Admin" role badge (gold)
- [ ] Super Admin can see "User Role" section in Edit User dialog
- [ ] Regular admins cannot see "User Role" section
- [ ] All admins can access Buy Crypto page
- [ ] All admins see Admin Console in sidebar
- [ ] New user registrations show as "On Hold" status
- [ ] Admins can approve users by changing status to "Active"
- [ ] Admins can grant Buy Access to specific users

---

## Troubleshooting

### "User not found" after registration
- Check Firebase Console → Authentication → Users
- The account should exist there
- Wait a few seconds and try logging in again

### "Access Denied" errors
- Verify the user's `status` is set to `'active'`
- Check if the user has required permissions
- Refresh the page after role changes

### Buy page not visible
- Ensure user is an admin OR has `buy_access: true`
- Check that status is `'active'` (on_hold users can't access it)
- Verify the role was saved correctly

### Can't promote users to admin
- Only Super Admins can change roles
- Verify you're logged in as Super Admin
- Check the browser console for errors

---

## Default Admin Credentials (For Reference)

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| albertbouvier646@gmail.com | Bouvier5526 | super_admin | Main system administrator |
| m.dubois5789@gmail.com | Dubois5526 | admin | Secondary administrator |
| info@honor-wallet.com | Honor5526 | admin | Support/operations admin |

**⚠️ IMPORTANT: Change these passwords after first login!**

---

## Next Steps

1. Create all 3 accounts in Firebase
2. Register/login with each account
3. Use browser console to set roles
4. Verify all permissions work correctly
5. Change passwords for security
6. Document any additional admins you create

---

**Your admin system is now configured with Super Admin and multi-tier permissions!**
