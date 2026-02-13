# Test Case – LAB1-01

## Test Case Attributes

- **TC ID:** LAB1-01  
- **Title:** Baseic shopping workflow  
- **Target App:** https://demowebshop.tricentis.com/  
- **Module:** Items / Cart / Checkout / Orders  
- **Objective:** Verify a user can register/login, add multiple expensive items (price > 900), manage cart (update/remove), and complete checkout successfully.  
- **Priority:** High  
- **Type:** UI E2E (Happy path + CRUD on cart)

### Preconditions
1. Site is available.  
2. Browser supports JavaScript.  
3. User is logged out.  
4. If using a new account, the email is not yet registered.  
5. Cart is empty.

### Test Data
- **Email:** `LAB1_auto+<timestamp>@mail.com` 
- **Name:** `Smart`
- **Surname:** `Bot`
- **Gender** `Male`
- **Password:** `Test123`  
- **Price threshold:** `> 900`  
- **Address:** `Lithuania, Vilnius, Jono g. 7, LT10322`
- **Phone Number** `+370 603 50030`

### Environment
- Local machine, Chrome/Edge, automation running locally

### Oracles / Verifications required
- UI messages  
- Element visibility  
- Cart totals  
- Order confirmation

### Entry Criteria
- Home page loads, user can navigate categories

### Exit Criteria
- Order placed **OR** failure captured with screenshots/logs

### Postconditions
- User logged out  
- Cart cleaned (remove all items)

---

## Test Steps

**Format:** Step — Action → Expected Result

1. Open browser → Browser starts.  
2. Navigate to https://demowebshop.tricentis.com/ → Home page loads, “Demo Web Shop” visible.  
3. Click **Log out** if already logged in.
4. Click **Register** → Registration page opens.  
5. Select **Gender** (Male) → Selection is applied.  
6. Input **First name**, **Last Name** → Fields accept input.  
7. Input unique **Email** → Field accepts input.  
8. Input **Password** and **Confirm password** → Fields accept input.  
9. Click **Register** → Success message “Your registration completed” is shown.  
10. Click **Log out**  → Account status is correct.  
11. Click **Log in** → Login page opens.  
12. Enter registered **Email** and **Password**, click **Log in** → User is logged in (account email link visible).  
13. Navigate to a category (**Computers → Desktops**) → Product listing page opens.  
14. For each product tile visible on the listing page, read the displayed **price** (text) → Price is captured for decision-making.  
15. Open product details for the first product with price > 900 and product name is not “Build your own computer” and not “Simple computer” (do not use site sorting/filtering) → Product details page opens. 
16. Click **Add to cart** → Confirmation (bar/message) appears; cart count increments.  
17. Return to the listing (Back) and repeat steps 13–15 until **at least 2 items** with **price > 900** are added → Cart has multiple expensive items.  
18. Click **Shopping cart** → Cart page opens; items are listed.  
19. **Verification #1:** Confirm cart contains **≥ 2 items** → Pass if true.  
20. **CRUD (Update):** Increase quantity for one item (e.g., set qty = 2) and click **Update shopping cart** → Quantity updates and totals recalculate.  
21. **Verification #2 (Arithmetic):** Verify **Total = Σ(line item subtotal)** (at least for the updated item: `unitPrice × qty = lineSubtotal`) → Pass if arithmetic matches the UI.  
22. **CRUD (Delete):** Remove one item using its **Remove** checkbox/button, then click **Update shopping cart** → Item disappears from the cart.  
23. **Verification #3:** Confirm removed item no longer appears → Pass if not present.  
24. Accept **Terms of service** checkbox → Checkbox is checked.  
25. Click **Checkout** → Checkout flow starts.  
26. Fill **Billing address** (new or existing) and continue → Moves to the next checkout step.  
27. Confirm **Shipping Adress**, press continue → Moves to the next section
28. Select **Shipping method** (any available) and continue → Moves forward.  
29. Select **Payment method** (e.g., Cash On Delivery) and continue → Payment info step opens.  
30. Continue from payment info → Order confirmation step opens.  
31. **Verification #4:** Verify the confirmation page shows correct items/quantities (at least one remaining expensive item) → Pass if it matches cart state.  
32. Click **Confirm** → Order is placed.  
33. **Verification #5:** Verify success message like “Your order has been successfully processed!” and an order number/details appear → Pass if success is shown.  
34. Navigate to **My account → Orders** → Orders list opens.  
35. Open the most recent order → Order details show purchased items.  
36. Log out → User is logged out; login link is visible.
