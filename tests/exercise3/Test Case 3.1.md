# Test Case –  LAB1 - Exercise 3 - Task 3.1

## Test Case Attributes

- **TC ID:** LAB1-EX3-1  
- **Title:** Progress Bar Synchronization
- **Target App:** https://demowebshop.tricentis.com/
- **Module:** Widgets → Progress Bar
- **Objective:** Verify that the progress bar starts, progresses, reaches 100%, and resets correctly.
- **Priority:** Medium  
- **Type:** UI / Synchronization

### Preconditions
1. Site is available.    
2. User is on homepage.
3. Progress Bar is at 0%.

### Test Data
* No external data required.

### Oracles / Verifications required
- Progress value increases after start.
- Progress reaches 100%.
- Reset button appears at completion.
- Reset returns value to 0%.

### Exit Criteria
- Progress reaches 100% and resets successfully.

### Postconditions
- Progress bar reset to 0%.

---

## Test Steps

**Format:** Step — Action → Expected Result

1. Open https://demoqa.com/ → Homepage loads
2. Click Widgets → Widgets section opens
3. Click Progress Bar → Progress Bar page loads
4. Verify progress value is "0%" → Initial state correct
5. Click Start → Progress begins increasing
6. Wait until progress reaches 100% → Progress completes
7. Verify Reset button is visible → Completion confirmed
8. Click Reset → Progress resets
9. Verify progress value returns to "0%" → Reset successful
