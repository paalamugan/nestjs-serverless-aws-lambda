## AWS Serverless Lambda with NestJS

This project is a sample project to demonstrate how to setup aws lambda function with nestjs.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Deployment
Before deployment, you need to setup aws credentials in your local machine. Refer below link for more details.
[https://www.serverless.com/framework/docs/providers/aws/guide/credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials)

- Dev environment
```bash
  yarn sls:deploy
```

- Prod environment
```bash
  yarn sls:deploy:prod
```

## Tips
- If you want to setup aws lambda function in serverless. you can refer below link.
[https://www.serverless.com/framework/docs/providers/aws/guide/credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials).
