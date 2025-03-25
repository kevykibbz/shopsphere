# ShopSphere E-Commerce Platform

![ShopSphere Logo](/public/assets/images/ecommerce-64.png) Shop Sphere


Modern eCommerce platform with secure payments, inventory management, and analytics dashboard. A full-featured e-commerce solution built with Node.js, Express, MongoDB, and PayPal integration.


🌐 **Live Demo**: [https://radiant-eagerness-production.up.railway.app/](https://radiant-eagerness-production.up.railway.app/)

## 🖥️ Key Application Screens

### Homepage
![ShopSphere Landing Page](/public/snapshots/landing.png)
*Features:*
- Hero banner with seasonal promotions
- Featured product carousel
- Category navigation menu
- Responsive design (mobile/desktop)

### Product Exploration
![Product Search Interface](/public/snapshots/search.png)
*Features:*
- Advanced search with auto-complete
- Filter by price/category/ratings
- Grid/list view toggle
- Pagination controls

### Add to Cart Flow
![Product Search Interface](/public/snapshots/cart1.png)
![Product Search Interface](/public/snapshots/cart2.png)
![Product Search Interface](/public/snapshots/cart3.png)
*Features:*
- One-click add from product pages
- Quantity adjuster (+/- buttons)
- Real-time updates (no page reload)

### Checkout Flow
![Payment Process](/public/snapshots/checkout.png)
![Payment Process](/public/snapshots/paypal.png)
![Payment Process](/public/snapshots/paypal2.png)
*Features:*
- Multi-step checkout
- PayPal sandbox integration
- Order summary
- Receipt generation

### Order History
![Purchase Tracking](/public/snapshots/orders.png)
*Features:*
- Chronological order listing
- Filter by date/status
- Detailed order breakdown
- Reorder functionality

## Admin Test Credentials

**Email:** test@gmail.com  
**Password:** Password1234  

*Note: This is a test admin account with full privileges. For security reasons, please change the password after initial login.*

## Features

- 🛍️ Product management (CRUD operations)
- 📊 Order processing dashboard
- 📈 Sales analytics
- 👥 User management
- 💳 PayPal sandbox integration
- 📦 Inventory tracking

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/[username]/ShopSphere.git
   cd ShopSphere
   ```
2. Installing Dependancies
    ```bash
    npm install
    ```
3. Configure environment variable
    ```bash
    cp .env.example .env
    ```
    Edit .env with your MongoDB and PayPal credentials
4. Run the application
    ```bash
    npm start
    ```
## Docker Deployment
    ```bash
    docker-compose up -d 
    ```
## Security Notes

- **Test Accounts**: The admin test account (`test@gmail.com`) should be disabled in production environments
- **Password Policy**: Always use strong passwords (12+ characters, mixed case, numbers, symbols) in live environments
- **Key Rotation**: Rotate API keys and credentials regularly (recommended every 90 days)
- **Session Management**: Implement proper session timeout policies
- **Updates**: Keep all dependencies updated with security patches

## Support

For security-related issues, please contact:  
📧 `security@shopsphere.example.com`  

For general support:  
📞 `+1 (555) 123-4567`  
💬 [Live Chat](https://support.shopsphere.example.com)

