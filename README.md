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
BASE_URL=<URL>
```

## Run tests

Run the below command to execute all the test cases.

```
npm run test
```

## Special notes
* I followed **3A (Arrange, Act, Assert)** practices on each test case.
* I followed the **Page Object Model** approach with folder structure.
* I created three test files focusing on the requirements of the assignment. (happy-path.spec.ts, unhappy-path.spec.ts and optional.spec.ts)
* I mainly run the test cases on the **Chromium** browser.

