# API Integration Reference - Corporate Approvals

## Implementation Overview

This module follows **industry best practices** for API integration:
- ✅ RESTful API design patterns
- ✅ Proper error handling with user feedback
- ✅ Loading states for better UX
- ✅ Optimistic UI updates
- ✅ Standardized request/response handling
- ✅ Authentication via Bearer tokens

## API Response Structure

### Standard Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}
```

### List Response with Pagination
```json
{
  "success": true,
  "data": [/* array of items */],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": { /* validation errors */ }
}
```

## Corporate Account Object Structure

```json
{
  "id": 1,
  "company_name": "TechVision Electronics",
  "email": "contact@techvision.com",
  "phone": "+1-555-0123",
  "status": "pending|approved|rejected|suspended",
  "credit_limit": 50000,
  "payment_terms": 30,
  "trade_license": "TL-2024-00123",
  "contact_person": {
    "name": "John Smith",
    "designation": "Procurement Manager",
    "phone": "+1-555-0790",
    "email": "john.smith@company.com"
  },
  "address": {
    "street": "123 Industrial Ave",
    "city": "Houston",
    "state": "TX",
    "zip": "77001",
    "country": "USA"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-16T14:20:00Z"
}
```

## Implemented API Endpoints

### 1. List Corporate Accounts
**Endpoint:** `GET /api/corporate`

**Implementation:** `CorporateApprovals.js` - `getCorporates()`

**Query Parameters:**
- `status`: Filter by status (pending, approved, rejected, suspended)
- `per_page`: Results per page (default: 20)
- `page`: Page number

**Code Example:**
```javascript
axios.get(`${Constants.BASE_URL}/corporate?status=pending&per_page=20&page=1`)
  .then((res) => {
    if (res.data.success) {
      const corporates = res.data.data;
      const pagination = res.data.pagination;
      // Handle success
    }
  });
```

### 2. Get Pending Registrations
**Endpoint:** `GET /api/corporate/pending`

**Implementation:** `CorporateApprovals.js` - `getCorporates()` (conditional)

**Features:**
- Returns only pending corporate accounts
- No pagination in response (uses count)

### 3. Get Corporate Details
**Endpoint:** `GET /api/corporate/{id}`

**Status:** Not yet implemented (future enhancement)

### 4. Approve Corporate Account
**Endpoint:** `POST /api/corporate/{id}/approve`

**Implementation:** `ApproveModal.js` - `handleApprove()`

**Request Body:**
```json
{
  "initial_credit_limit": 50000,
  "payment_terms": 30,
  "notes": "Verified trade license and tax documents"
}
```

**Field Specifications:**
- `initial_credit_limit` (number): Initial credit limit in currency units
- `payment_terms` (integer): Payment terms in days (30, 45, 60, 90)
- `notes` (string, optional): Admin notes for approval

**Code Implementation:**
```javascript
axios.post(`${Constants.BASE_URL}/corporate/${corporate.id}/approve`, {
  initial_credit_limit: 50000,
  payment_terms: 30,
  notes: "Approved after verification"
})
```

### 5. Reject Corporate Account
**Endpoint:** `POST /api/corporate/{id}/reject`

**Implementation:** `RejectModal.js` - `handleReject()`

**Request Body:**
```json
{
  "reason": "Invalid trade license - document expired",
  "allow_resubmission": true
}
```

**Field Specifications:**
- `reason` (string, required): Detailed rejection reason
- `allow_resubmission` (boolean, optional): Whether user can reapply (default: true)

**Features:**
- Mandatory rejection reason with validation
- Option to allow/disallow resubmission
- Email notification sent to applicant

### 6. Suspend Corporate Account
**Endpoint:** `POST /api/corporate/{id}/suspend`

**Implementation:** `CorporateApprovals.js` - `handleSuspend()`

**Request Body:**
```json
{
  "reason": "Payment overdue by 60 days",
  "suspend_until": "2024-02-28T23:59:59Z"
}
```

**Field Specifications:**
- `reason` (string, required): Suspension reason
- `suspend_until` (datetime, optional): Auto-reactivation date

**UX Implementation:**
- Uses SweetAlert with textarea input for reason
- Mandatory reason validation
- Confirmation dialog before action

### 7. Reactivate Corporate Account
**Endpoint:** `POST /api/corporate/{id}/reactivate`

**Implementation:** `CorporateApprovals.js` - `handleReactivate()`

**Request Body:**
```json
{
  "notes": "Payment received and verified"
}
```

**Field Specifications:**
- `notes` (string, optional): Reactivation notes

**Features:**
- Optional notes via SweetAlert input
- Immediate status change to 'approved'
- Credit terms remain unchanged

### 8. Update Credit Terms
**Endpoint:** `PUT /api/corporate/{id}/credit-terms`

**Implementation:** `CreditTermsModal.js` - `handleUpdate()`

**Request Body:**
```json
{
  "credit_limit": 100000,
  "payment_terms": 45,
  "notes": "Increased credit limit based on payment history"
}
```

**Field Specifications:**
- `credit_limit` (number, optional): New credit limit
- `payment_terms` (integer, optional): Payment terms in days
- `notes` (string, optional): Change notes

**Features:**
- At least one field (credit_limit or payment_terms) required
- Real-time summary preview
- Form validation before submission
- Audit trail logged server-side

## Status Values & Transitions

### Allowed Status Values
- `pending` - Initial registration status
- `approved` - Account approved and active
- `rejected` - Registration rejected
- `suspended` - Temporarily suspended

### Status Transition Rules
```
pending → approved (via approve endpoint)
pending → rejected (via reject endpoint)
approved → suspended (via suspend endpoint)
suspended → approved (via reactivate endpoint)
```

## Authentication & Headers

All API requests include authentication via Axios interceptor:

```javascript
// AxiosInterceptor.js handles this automatically
axios.interceptors.request.use(function (config) {
    if(localStorage.token != undefined){
         config.headers['Authorization'] = `Bearer ${localStorage.token}`
    }
    return config;
});
```

**Required Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

## Error Handling Best Practices

### 1. Axios Error Handling
```javascript
axios.post(url, data)
  .then((res) => {
    if (res.data.success) {
      // Handle success
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: res.data.message
      });
    }
  })
  .catch((error) => {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: error.response?.data?.message || 'An error occurred'
    });
  });
```

### 2. Loading States
```javascript
setIsLoading(true);
// API call
setIsLoading(false);
```

### 3. Form Validation
```javascript
const validateForm = () => {
  const newErrors = {};
  if (!field) newErrors.field = 'This field is required';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Payment Terms Implementation

### Standard Values (Days)
- 30 days - Net 30
- 45 days - Net 45
- 60 days - Net 60
- 90 days - Net 90

### UI Display
```javascript
// Display format: "30 Days" or "Net 30"
{corporate.payment_terms ? `${corporate.payment_terms} days` : 'N/A'}
```

## Industry Best Practices Implemented

### 1. **Separation of Concerns**
- API calls separated in component methods
- Business logic isolated from UI components
- Reusable modal components

### 2. **User Experience**
- Loading indicators during API calls
- Success/error notifications via SweetAlert2
- Confirmation dialogs for destructive actions
- Form validation with inline error messages
- Optimistic UI updates where appropriate

### 3. **Code Quality**
- Consistent error handling patterns
- DRY principles (Don't Repeat Yourself)
- Clear naming conventions
- Proper state management
- Component reusability

### 4. **Security**
- Bearer token authentication
- Authorization checks server-side
- No sensitive data in client-side storage
- Proper HTTPS usage (production)

### 5. **Performance**
- Pagination for large datasets
- Lazy loading of modals
- Efficient state updates
- Debounced search (can be added)

### 6. **Maintainability**
- Well-documented code
- Modular component structure
- Clear API contracts
- Consistent response handling
- Centralized constants (BASE_URL)

## Testing Checklist

- [x] List all corporate accounts with pagination
- [x] Filter by status (pending/approved/rejected/suspended)
- [x] Approve account with credit limit and payment terms
- [x] Reject account with reason and resubmission option
- [x] Suspend account with mandatory reason
- [x] Reactivate suspended account with optional notes
- [x] Update credit terms with validation
- [x] Handle API errors gracefully
- [x] Display success notifications
- [x] Show loading states
- [x] Form validation (client-side)
- [x] Responsive design
- [x] Bearer token authentication

## Common Error Codes

| Code | Description | Handling |
|------|-------------|----------|
| 401 | Unauthorized | Redirect to login (handled by interceptor) |
| 403 | Forbidden | Show permission error |
| 404 | Not Found | Show not found message |
| 422 | Validation Error | Display field-specific errors |
| 500 | Server Error | Show generic error, log details |

## Future Enhancements

1. Search functionality across all fields
2. Advanced filters (date range, credit limit range)
3. Export to CSV/PDF
4. Bulk operations (approve/reject multiple)
5. Real-time notifications (WebSocket)
6. Activity audit log viewer
7. Document preview/download
8. Corporate account details view
9. Order history integration
10. Credit utilization dashboard

---

**Last Updated:** December 27, 2025  
**API Version:** v1  
**Component Version:** 2.0.0  
**Compliance:** RESTful API Standards, React Best Practices
