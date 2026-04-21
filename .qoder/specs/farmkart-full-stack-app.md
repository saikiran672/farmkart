# FarmKart - Full-Stack Marketplace Application

## Context
Build a complete farmer-to-consumer marketplace from scratch in an empty directory. The app allows farmers to list fresh produce and customers to browse, cart, and order products. Stack: HTML/CSS/JS frontend, Node.js/Express backend, MongoDB database, JWT auth.

## Project Structure

```
4032/
├── .env                          # MongoDB URI, JWT secret, port
├── .gitignore
├── package.json
├── server.js                     # Express entry point
├── config/
│   └── db.js                     # Mongoose connection
├── models/
│   ├── User.js                   # name, email, password (bcrypt), role (farmer/customer)
│   ├── Product.js                # name, desc, price, category, imageUrl, quantity, unit, farmer ref
│   ├── Cart.js                   # user ref (unique), items[] with product ref + quantity
│   └── Order.js                  # customer ref, items[] (snapshots), totalAmount, status, address
├── middleware/
│   ├── auth.js                   # JWT verification -> req.user
│   └── role.js                   # authorize(...roles) factory
├── controllers/
│   ├── authController.js         # register, login, getMe
│   ├── productController.js      # CRUD + farmer's products + search/filter
│   ├── cartController.js         # get, add, update qty, remove, clear
│   └── orderController.js        # place order, history, detail, update status
├── routes/
│   ├── auth.js                   # /api/auth/*
│   ├── products.js               # /api/products/*
│   ├── cart.js                   # /api/cart/*
│   └── orders.js                 # /api/orders/*
└── public/                       # Static files served by Express
    ├── index.html                # Home/landing page
    ├── products.html             # Product listing with filters
    ├── product-detail.html       # Single product view
    ├── login.html / signup.html  # Auth forms
    ├── cart.html                 # Shopping cart
    ├── orders.html               # Order history
    ├── farmer-dashboard.html     # Farmer product management
    ├── about.html / contact.html # Info pages
    ├── css/style.css             # Global stylesheet (green/earth-tone design system)
    └── js/
        ├── api.js                # Shared fetch wrapper + token management
        ├── nav.js                # Dynamic navbar (role-aware)
        ├── auth.js               # Login/signup form logic
        ├── home.js               # Featured products on landing
        ├── products.js           # Product grid + search/category filter
        ├── product-detail.js     # Detail view + add-to-cart
        ├── cart.js               # Cart management
        ├── orders.js             # Order history display
        └── farmer-dashboard.js   # Add/edit/delete products
```

## API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/auth/register | None | Create account (farmer/customer) |
| POST | /api/auth/login | None | Login, returns JWT |
| GET | /api/auth/me | JWT | Current user profile |
| GET | /api/products | None | List products (?category, ?search, ?page, ?limit) |
| GET | /api/products/:id | None | Single product detail |
| POST | /api/products | JWT+farmer | Create product |
| PUT | /api/products/:id | JWT+farmer(owner) | Update product |
| DELETE | /api/products/:id | JWT+farmer(owner) | Delete product |
| GET | /api/products/farmer/me | JWT+farmer | Farmer's own products |
| GET | /api/cart | JWT | Get user's cart |
| POST | /api/cart | JWT | Add item to cart |
| PUT | /api/cart/:itemId | JWT | Update item quantity |
| DELETE | /api/cart/:itemId | JWT | Remove item |
| DELETE | /api/cart | JWT | Clear cart |
| POST | /api/orders | JWT | Place order from cart |
| GET | /api/orders | JWT | Order history |
| GET | /api/orders/:id | JWT | Order detail |
| PUT | /api/orders/:id/status | JWT+farmer | Update order status |

## Implementation Order (6 Phases)

### Phase 1: Scaffolding (files 1-4)
1. `package.json` - deps: express, mongoose, bcryptjs, jsonwebtoken, dotenv, cors; dev: nodemon
2. `.env` - MONGODB_URI, JWT_SECRET, PORT
3. `.gitignore` - node_modules/, .env
4. `config/db.js` - Mongoose connect function

### Phase 2: Models (files 5-8)
5. `models/User.js` - bcrypt pre-save hook, comparePassword method, select('-password')
6. `models/Product.js` - category enum, farmer ref, compound index
7. `models/Cart.js` - one cart per user (unique user), items subdocuments
8. `models/Order.js` - item snapshots (name+price), status enum

### Phase 3: Middleware (files 9-10)
9. `middleware/auth.js` - Extract Bearer token, verify, attach req.user
10. `middleware/role.js` - authorize() factory checking req.user.role

### Phase 4: Controllers + Routes (files 11-18)
11-12. Auth controller + routes
13-14. Product controller + routes (with ownership checks)
15-16. Cart controller + routes
17-18. Order controller + routes (snapshot items, decrement stock, clear cart)

### Phase 5: Server Assembly (file 19)
19. `server.js` - dotenv, db connect, middleware, static serving, route mounting, error handler

### Phase 6: Frontend (files 20-31)
20. `public/css/style.css` - Full design system with CSS variables, responsive grid
21. `public/js/api.js` - apiFetch(), getUser(), requireAuth(), showToast()
22. `public/js/nav.js` - Dynamic navbar with role-based links, mobile hamburger
23. Home page (index.html + home.js)
24. Auth pages (login.html + signup.html + auth.js)
25. Products listing (products.html + products.js)
26. Product detail (product-detail.html + product-detail.js)
27. Cart (cart.html + cart.js)
28. Orders (orders.html + orders.js)
29. Farmer dashboard (farmer-dashboard.html + farmer-dashboard.js)
30. About page (about.html)
31. Contact page (contact.html)

## Design System
- **Colors**: Primary green `#2d6a4f`, light `#52b788`, dark `#1b4332`, earthy accent `#d4a373`, bg `#fefae0`
- **Layout**: CSS Grid for page layout, Flexbox for components, responsive at 768px/480px breakpoints
- **Product grid**: `repeat(auto-fill, minmax(280px, 1fr))`
- **No external CSS frameworks** - pure CSS

## Key Patterns
- **Frontend**: Every page loads api.js -> nav.js -> page.js in order
- **Backend**: async controller with try/catch, consistent error responses
- **Auth flow**: JWT in localStorage, auto-attached by apiFetch(), 401 redirects to login
- **Order placement**: Fetch cart -> verify stock -> snapshot items -> calc total -> decrement stock -> clear cart

## Verification
1. `npm install` to install dependencies
2. Start MongoDB locally (or use Atlas URI in .env)
3. `node server.js` to start the server
4. Test full flow: Register farmer -> Add products -> Register customer -> Browse -> Add to cart -> Place order -> Check order history -> Farmer views dashboard
