## Getting Started with the Project

- The idea is to build a simple application using AWS Cognito, AWS S3, AWS DynamoDB and AWS Lambda
- User uploads file to S3
- Uploaded files of .txt format sends  a trigger to update the Dynamo DB.
- User authenticates via Cognito to get the list of records from the table.

### ARCHITECTURE DIAGRAM

![File images](./assets/cloud_arch.png)

### Executing the project

- Run `npm install` to install all required packages
- Run `npm start` to execute the React project

