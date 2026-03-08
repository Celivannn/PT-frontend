# Minute Burger Online Ordering System

## Project Overview

A complete web-based online ordering and shopping cart system for Minute Burger, built with Django backend and React frontend. The system automates order processing, improves transaction accuracy, and enhances customer experience by allowing customers to order online for pickup.

## Features

### Customer Features
- User registration and login with JWT authentication
- Browse products by categories
- Product search and filtering
- Shopping cart management
- Place orders with cash on pickup
- View order history and track order status
- User profile management

### Admin Features
- Admin dashboard with analytics
- Order management (view and update order status)
- Product management (CRUD operations)
- Category management
- Customer management
- Sales reports and analytics
- System settings configuration

## Technology Stack

### Backend
- Django 4.2
- Django REST Framework
- MySQL database
- JWT authentication
- CORS headers

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- shadcn-ui components
- Axios for API calls
- React Router for navigation

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8+ 
- Node.js 16+
- XAMPP (with MySQL and phpMyAdmin)
- Git (optional)

## Installation Guide

### Step 1: Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd minute-burger-system
```

### Step 2: Set Up the Database

1. Start XAMPP Control Panel
2. Start Apache and MySQL services
3. Open phpMyAdmin at http://localhost/phpmyadmin
4. Create a new database named `minuteburger_db`

### Step 3: Set Up the Backend (Django)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
# On Windows:
python -m venv venv
venv\Scripts\activate

# On Mac/Linux:
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Create a superuser (admin)
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver
```

The backend API will be available at http://127.0.0.1:8000

### Step 4: Set Up the Frontend (React)

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm run dev
```

The frontend application will be available at http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - Get user profile
- `POST /api/token/refresh/` - Refresh access token

### Products
- `GET /api/categories/` - Get all categories
- `GET /api/products/` - Get all products
- `GET /api/products/{id}/` - Get single product

### Cart (Authenticated)
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/update/{item_id}/` - Update cart item
- `DELETE /api/cart/remove/{item_id}/` - Remove item from cart
- `DELETE /api/cart/clear/` - Clear entire cart

### Orders (Authenticated)
- `POST /api/orders/create/` - Create new order
- `GET /api/orders/` - Get user's orders
- `GET /api/orders/{order_number}/` - Get specific order

### Admin Endpoints (Admin Only)
- `GET /api/admin/orders/` - Get all orders
- `PUT /api/admin/orders/{order_number}/` - Update order status
- `POST /api/admin/products/create/` - Create new product
- `PUT /api/admin/products/update/{id}/` - Update product
- `DELETE /api/admin/products/delete/{id}/` - Delete product
- `POST /api/admin/categories/create/` - Create new category
- `GET /api/admin/analytics/` - Get sales analytics

## Project Structure

```
minute-burger-system/
├── backend/           # Django backend API
│   ├── minuteburger/  # Main Django project
│   ├── api/          # API app
│   ├── authentication/# Authentication app
│   ├── orders/       # Orders app
│   ├── products/     # Products app
│   ├── analytics/    # Analytics app
│   └── requirements.txt
│
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── lib/         # Utilities
│   │   └── App.tsx      # Main app component
│   └── package.json
│
└── database/          # MySQL database scripts
```

## Usage

### Customer Flow
1. Register/Login to your account
2. Browse the menu and add items to cart
3. Review cart and proceed to checkout
4. Enter contact details and place order
5. Track order status in real-time
6. Pick up your order at the store

### Admin Flow
1. Login with admin credentials
2. View dashboard with sales analytics
3. Manage orders (update status, view details)
4. Add/edit/delete products
5. Manage categories
6. View customer information
7. Generate sales reports

## Troubleshooting

### Common Issues

**Backend won't start**
- Ensure MySQL is running in XAMPP
- Check if port 8000 is available
- Verify database `minuteburger_db` exists

**Frontend can't connect to backend**
- Ensure backend is running on http://127.0.0.1:8000
- Check CORS settings in Django
- Verify API URLs in frontend code

