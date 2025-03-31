# Playwright-challenge
Repository that contains the solution to a QA Challenge for Automation Engineers using Playwright.

## Precondition
Node 14+ above should be installed.

## How to run the tests? Using VSCode
- Clone repo:

```
git clone https://github.com/angiecornejo/Playwright-challenge
```

- Exectue command:
```
npm init playwright@latest  
```

- To execute all tests:

```
npx playwright test
```
- To execute each test:

```
 npx playwright test --grep "stock_validation"

 npx playwright test --grep "cart_validation"
```

## 

## Assumptions and limitations 
- Sometimes Amazon will ask if you are a robot, so there should be an action to avoid that scenario. 
- As i live in Argentina, Amazon loads in Spanish by default. I want to search for the word 'Wireless headphones' and see if it has stock, so I think its better to select English as the main language at the start.
- I tried to mimic the behaviour of a real user since it failed when i used the regular 'Select':
##### Regular select:  await page.getByLabel('Quantity:').selectOption('3');) 
##### Mimic of the real users: await page.locator('//select[@name="quantity"]').focus(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); 

- I originally intendeed to run the tests in GitHub actions, and in order to do that I have to run the tests in Headless mode. However, beacuse of the issue I had with the selection of the quantity, i need to run it with the following configuration:
 ##### use {headless: false}

- I had to use navigationPromise constants because sometimes it didn't loaded correctly after you clicked a button and the tests failed.
- The tests can fail if www.amazon.com doesn't load correctly at the start. 
