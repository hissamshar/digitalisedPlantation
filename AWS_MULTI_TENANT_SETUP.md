# Multi-Tenant AWS Architecture for Digitalized Plantation

To allow every ESP32 user to log into the dashboard and view *only* their own device's data, you need to transition from a single mock dashboard to a multi-tenant AWS architecture. 

Here is the step-by-step guide to setting this up using AWS services.

## Architecture Overview

1. **ESP32 Devices**: Publish telemetry to AWS IoT Core, but now include a `deviceId` in the topic or payload (e.g., topic: `telemetry/alpha-1`).
2. **AWS IoT Rules**: An IoT Rule listens to `telemetry/#` and writes the incoming JSON payloads into a **DynamoDB Table**, updating the latest state for each `deviceId`.
3. **AWS Cognito**: Manages user sign-ups, log-ins, and secure access tokens (JWTs). Each user account will have a custom attribute (e.g., `custom:deviceId`) linking them to their specific ESP32.
4. **Amazon API Gateway & AWS Lambda**: Provides a secure REST API. The API Gateway validates the Cognito JWT token. The Lambda function reads the user's `deviceId` from the token and fetches only that device's data from DynamoDB.
5. **React Dashboard**: Users log in. The React app gets a secure token, calls the API Gateway, and displays the live data.

---

## Step 1: Set up DynamoDB
1. Go to **DynamoDB** in the AWS Console.
2. Click **Create table**.
3. Table name: `PlantationTelemetry`
4. Partition key: `deviceId` (String)
5. Leave other settings as default and create the table.

---

## Step 2: Route IoT Data to DynamoDB
1. Go to **AWS IoT Core** -> **Message routing** -> **Rules**.
2. Click **Create rule**. Name it `RouteTelemetryToDynamoDB`.
3. **SQL Statement**: 
   ```sql
   SELECT * FROM 'sdk/test/js' 
   ```
   *(Note: In production, you should make devices publish to `telemetry/${deviceId}` and use `SELECT * FROM 'telemetry/+'`)*
4. **Action**: Choose **DynamoDBv2**.
5. Select the `PlantationTelemetry` table.
6. Create an IAM role when prompted to allow IoT Core to write to DynamoDB.
7. Save and enable the rule. Now, every time the ESP32 publishes, DynamoDB will be updated with the latest sensor readings.

---

## Step 3: Set up Amazon Cognito for Users
1. Go to **Amazon Cognito** -> **User Pools**.
2. Click **Create user pool**.
3. **Sign-in options**: Email.
4. **Security requirements**: Default password policy.
5. **Sign-up experience**: Add a custom attribute named `deviceId` (Type: String). This will link the user to their hardware.
6. Complete the setup and note down your **User Pool ID** and **App Client ID**.
7. Create a test user in the pool, and set their `custom:deviceId` to match your ESP32's ID (e.g., `alpha-1`).

---

## Step 4: Create the Data Fetch API (Lambda + API Gateway)

### Create the Lambda Function
1. Go to **AWS Lambda** -> **Create function**. Name it `GetDeviceTelemetry`.
2. Runtime: **Python 3.12**.
3. Execution Role: Ensure the role has `AmazonDynamoDBReadOnlyAccess`.
4. Code:
```python
import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('PlantationTelemetry')

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
    }

    # Extract deviceId from the Cognito token (authorizer)
    try:
        claims = event['requestContext']['authorizer']['claims']
        device_id = claims.get('custom:deviceId')
        
        if not device_id:
            return {'statusCode': 403, 'headers': cors_headers, 'body': json.dumps({'error': 'No device ID assigned'})}
            
        response = table.get_item(Key={'deviceId': device_id})
        item = response.get('Item')
        
        if not item:
            return {'statusCode': 404, 'headers': cors_headers, 'body': json.dumps({'error': 'No data found for device'})}
            
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps(item, default=decimal_default)
        }
    except Exception as e:
        return {'statusCode': 500, 'headers': cors_headers, 'body': json.dumps({'error': str(e)})}
```

### Create the API Gateway
1. Go to **API Gateway** -> **Build** a REST API.
2. Name it `PlantationAPI`.
3. Create a **GET** method attached to your Lambda function.
4. Under **Authorizers**, create a new Cognito User Pool Authorizer linking to your User Pool.
5. Attach the Authorizer to your GET method.
6. Enable **CORS** on the API.
7. Deploy the API to a stage (e.g., `prod`) and copy the **Invoke URL**.

---

## Next Steps for the Code
I will now update your React app (`App.tsx`) to include a Login Page that transitions into the `LiveDashboard`. 

Once you have your AWS API Gateway URL and Cognito setup, we can connect the React app directly to AWS using standard `fetch()` calls or the `aws-amplify` library!
