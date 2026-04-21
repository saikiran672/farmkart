FarmKart - Farm Fresh Marketplace
==================================

SETUP INSTRUCTIONS (Windows)
-----------------------------

Step 1: Install Node.js
   - Download from: https://nodejs.org/
   - Install with default settings

Step 2: Install MongoDB
   - Download from: https://www.mongodb.com/try/download/community
   - Install with default settings (make sure "Install as Service" is checked)
   - MongoDB will run automatically in the background

Step 3: Run the App
   - Double-click "START.bat"
   - It will install dependencies and start the server
   - Open http://localhost:3000 in your browser

That's it! The app is ready to use.


HOW TO USE
-----------
1. Sign up as a "Farmer" to add and manage products
2. Sign up as a "Customer" to browse, add to cart, and place orders
3. Farmers can manage products from the Dashboard
4. Customers can view order history from My Orders


MANUAL START (if START.bat doesn't work)
-----------------------------------------
Open Command Prompt in this folder and run:
   npm install
   node server.js

Then open http://localhost:3000 in your browser.
