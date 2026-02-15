# Test Case –  LAB1 - Exercise 3 - Task 3.1

## Test Case Attributes

- **TC ID:** LAB1-EX3-2
- **Title:** Dynamic Properties Verification
- **Target App:** https://demoqa.com/
- **Module:**  Elements → Dynamic Properties
- **Objective:**  Verify dynamic behavior of elements (delayed enable, color change, delayed visibility).
- **Priority:** Medium
- **Type:**  UI / Dynamic DOM

### Preconditions
1. Site is available.    
2. User is on homepage.

### Test Data
* No external data required.

### Oracles / Verifications required
- Button becomes enabled after 5 seconds.
- Button color changes after delay.
- Element becomes visible after 5 seconds.

###  Exit Criteria
- All dynamic behaviors validated successfully.

### Postconditions
- No data created.
- Page left in stable state.

---

## Test Steps

**Format:** Step — Action → Expected Result

- Open https://demoqa.com/ → Homepage loads
- Click Elements → Elements section opens
- Click Dynamic Properties → Page loads
- Verify "Enable After" button is disabled → Initial state correct
- Wait until button becomes enabled → Button enabled after delay
- Verify that "Color Change" button changes color after some time → CSS Style updated
- Verify "Visible After 5 Seconds" button becomes visible → Element appears