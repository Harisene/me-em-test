# Welcome to ME+EM Playwright test

Please follow the below steps to run the project locally.

## Clone

Clone the project to your machine using the below command.

```
https://github.com/Harisene/me-em-test.git
```

## Install dependencies

Run the command below to install all the project dependencies.

```
npm install
```

## Setup environment variables

Need to provide `BASE_URL` of the website to run tests. Create a `.env` file in the root folder and add the below variable to it.

```
BASE_URL=<URL> // https://yourwebsite.com
```

## Run tests on Chromium

This command will run all the tests on the Chromium browser.

```
npm run test-chromium
```

## Run tests on Chromium, Firefox and Webkit

This command will run all the tests on the Chromium, Firefox and Webkit browsers.

```
npm run test
```

## Special notes
* I followed **3A (Arrange, Act, Assert)** practices on each test case.
* I followed the **Page Object Model** approach with folder structure.
* I created three test files focusing on the requirements of the assignment. (happy-path.spec.ts, unhappy-path.spec.ts and optional.spec.ts)
* I mainly ran the test cases on the **Chromium** browser.
* Sometimes a couple of test cases fail for Firefox and Webkit. Chromium passes all the test cases.

## Things could do if have more time
* Fix tests that fail for Firefox and Webkit but work on Chromium.
* Write test cases for different view ports.

