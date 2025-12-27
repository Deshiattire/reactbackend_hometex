# Corporate Approvals Module

## Overview
A modern, user-friendly approval management system for handling corporate account applications. This module provides a comprehensive interface for reviewing, approving, rejecting, and managing corporate accounts with credit terms.

## Features

### 🎯 Multi-Tab Interface
- **Corporate Accounts**: Fully functional approval system
- **Product Reviews**: Coming soon
- **Other Approvals**: Coming soon

### 📋 Corporate Approvals Dashboard
- **Smart Filtering**
  - Pending approvals
  - Approved accounts
  - Rejected applications
  - Suspended accounts
  - All status view

- **Advanced Search & Sorting**
  - Search by company name, email, or contact
  - Sort by date created, company name, or credit limit
  - Configurable pagination (10, 25, 50, 100 per page)

- **Real-time Statistics**
  - Pending approval count
  - Visual status indicators

### 🔧 Account Actions

#### 1. **Approve Account**
- Review complete corporate information
- Add optional approval notes
- Instant notification to applicant

#### 2. **Reject Account**
- Mandatory rejection reason
- Email notification with detailed feedback
- Clear audit trail

#### 3. **Update Credit Terms**
- Configure credit limit
- Set payment terms (Net 30/60/90, custom)
- Define credit period in days
- Set interest rates
- Add special conditions
- Real-time summary display

#### 4. **Suspend Account**
- Quick suspension with confirmation
- Immediate access restriction
- Option to reactivate

#### 5. **Reactivate Account**
- Restore suspended accounts
- Single-click reactivation

## Technical Implementation

### Components Structure
```
src/components/modules/approvals/
├── Approvals.js              # Main approval page with tabs
├── CorporateApprovals.js     # Corporate approval management
└── modals/
    ├── ApproveModal.js       # Approve account modal
    ├── RejectModal.js        # Reject account modal
    └── CreditTermsModal.js   # Update credit terms modal
```

### API Integration

#### Endpoints Used
```javascript
GET  /api/corporate              # List all corporates with filters
GET  /api/corporate/pending      # Get pending approvals
POST /api/corporate/{id}/approve # Approve an account
POST /api/corporate/{id}/reject  # Reject an account
POST /api/corporate/{id}/suspend # Suspend an account
POST /api/corporate/{id}/reactivate # Reactivate account
PUT  /api/corporate/{id}/credit-terms # Update credit terms
```

#### Request/Response Examples

**Approve Account**
```javascript
POST /api/corporate/123/approve
{
  "notes": "Approved based on credit check"
}
```

**Reject Account**
```javascript
POST /api/corporate/123/reject
{
  "reason": "Insufficient documentation provided"
}
```

**Update Credit Terms**
```javascript
PUT /api/corporate/123/credit-terms
{
  "credit_limit": 50000,
  "payment_terms": "Net 30",
  "credit_period_days": 30,
  "interest_rate": 2.5,
  "notes": "Standard corporate terms"
}
```

### State Management
- Local state using React hooks
- Real-time updates after actions
- Optimistic UI updates with error handling

### UI/UX Features

#### Design Elements
- **Modern Gradient Backgrounds**: Visual appeal with gradient overlays
- **Minimalistic Icons**: Font Awesome icons for intuitive navigation
- **Responsive Layout**: Works on all screen sizes
- **Smooth Animations**: Hover effects and transitions
- **Color-Coded Status**: Quick visual identification
  - 🟡 Yellow: Pending
  - 🟢 Green: Approved
  - 🔴 Red: Rejected
  - ⚫ Dark: Suspended

#### User Experience
- **Single-Click Actions**: Quick access to common operations
- **Confirmation Dialogs**: Prevent accidental actions
- **Loading States**: Clear feedback during API calls
- **Error Handling**: Informative error messages
- **Success Notifications**: Visual confirmation of actions

## Usage

### Accessing the Module
1. Navigate to the sidebar
2. Click on "Approvals" (visible for admin users)
3. Select "Corporate Accounts" tab

### Approving an Account
1. Filter to view "Pending Approvals"
2. Review corporate details in the table
3. Click "Approve" button
4. Review account information in modal
5. Add optional notes
6. Confirm approval

### Rejecting an Account
1. Locate the corporate account
2. Click "Reject" button
3. Enter mandatory rejection reason
4. Confirm rejection
5. Email notification sent automatically

### Managing Credit Terms
1. Find approved corporate account
2. Click "Credit Terms" button
3. Update:
   - Credit limit ($)
   - Payment terms
   - Credit period (days)
   - Interest rate (%)
4. Add additional notes if needed
5. Save changes

### Suspending/Reactivating
- **Suspend**: Click "Suspend" on approved accounts
- **Reactivate**: Click "Reactivate" on suspended accounts

## Code Quality & Best Practices

### ✅ Implemented Best Practices
- **Component Modularity**: Separated modals and main components
- **Reusability**: Modal components can be reused
- **Error Handling**: Comprehensive try-catch blocks
- **Validation**: Form validation before API calls
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Performance**: Optimized re-renders with proper state management
- **Code Consistency**: Follows project coding standards
- **Responsive Design**: Mobile-first approach

### 🎨 Design Principles
- **Minimalism**: Clean, uncluttered interface
- **Consistency**: Uniform styling across components
- **Feedback**: Clear user feedback for all actions
- **Hierarchy**: Clear information architecture
- **Accessibility**: High contrast, readable fonts

## Dependencies
- React 18+
- React Bootstrap (Modals)
- Axios (API calls)
- SweetAlert2 (Notifications)
- React-js-pagination (Pagination)
- Font Awesome (Icons)

## Future Enhancements
- Product reviews approval system
- Batch approval operations
- Advanced analytics dashboard
- Export functionality (PDF/Excel)
- Email template customization
- Approval workflow automation
- Role-based approval hierarchy

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes
- Requires authentication token in localStorage
- Admin privileges needed for access
- All actions are logged for audit purposes
- Email notifications configured server-side

---

**Created**: December 27, 2025
**Version**: 1.0.0
**Status**: Production Ready
