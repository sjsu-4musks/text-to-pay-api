# SP23: CMPE-282 Sec 48 - Cloud Services

University Name: **[San Jose State University](http://www.sjsu.edu)**

## Team Members

Nihal Kaul [Linkedin](https://www.linkedin.com/in/nihalwashere)

Utsav Rawat [Linkedin](https://www.linkedin.com/in/utsav-rawat-a519aa131)

Jaya Krishna Thupili [Linkedin](https://www.linkedin.com/in/thupili)

Ninad Marathe [Linkedin](https://www.linkedin.com/in/thupili)

## Project Introduction

   The 'Text to Pay' project is an innovative venture that aims to revolutionize the way businesses handle transactions and interact with their customers.
   Recognizing the need for an effective and efficient way to facilitate payments, this project introduces a method that enables consumers to make payments via text messages.
   The underlying goal of the 'Text to Pay' project is to streamline the payment process, improve customer engagement, and ultimately increase conversion rates and customer retention for businesses across various sectors.

## Main objectives

    * Streamline Payments.
    * Improve Customer Engagement
    * Increase Conversion Rates
    * Enhance Customer Retention
    * Facilitate Onboarding of New Customers
    * Boost Security

## Architect Diagram

![Text-to-pay-Architecture_v2](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/91a61d7e-47d2-4e54-b7d8-32b3e32156c1)

## UML Class Diagram

![image](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/7818a8ee-0bad-419f-abb2-89ee232670b1)

## Sequence Diagram

![Use Case Sequence](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/4da8bf43-b2dd-4fa3-8cb6-f2a180a17995)

## Pre-requisites Set Up

### Frontend

```
Node.js -Version 18 https://nodejs.org/en/

Frontend Technologies: React.js

git clone https://github.com/sjsu-4musks/text-to-pay-app.git
cd text-to-pay-app
npm install -g @angular/cli
npm start

Server will be running on ‘https://localhost:3000/’ 
```

### Backend API

set following environment variables values:

```
PORT=7000
LOG_LEVEL=debug
APP_ENV=prod
MONGO_URL=mongodb+srv://cluster.7qvsti3.mongodb.net/text-to-pay?retryWrites=true&w=majority
JWT_SECRET_KEY=this-is-our-secret-key
APP_HOST_URL=localhost:3000
STRIPE_SECRET_KEY=
STRIPE_WEBHOOKS_SIGNING_SECRET=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
TWILIO_ACCOUNT_SID=ACbxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=9bxxxxxxxxxxx
TWILIO_FROM_NUMBER=+1234567890
```
```
git clone https://github.com/sjsu-4musks/text-to-pay-api.git
cd text-to-pay-api
node start
```

### AWS Configuration Screenshots

#### AWS Codepipeline for CI/CD

![codepipeline](resources/AWS%20CodePipeline.jpeg)

#### Build History

![image](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/b2ee218f-69c9-4692-b835-03facaa4f539)

#### pipeline Git Webhook

![Pipeline](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/1d5f1bec-91f0-4dcb-8dbd-42ff0f706aad)

#### AWS S3 Static web hosting

![S3](resources/AWS%20S3.jpeg)

#### AWS CloudFront for caching

![CloudFront](resources/AWS%20CloudFront.jpeg)

#### SSL Certificate for Secure Domain

![AWS ACM](resources/AWS%20ACM%20Manager.jpeg)

![GoDaddy](resources/AWS%20GoDaddy%20DNS.jpeg)

#### SSL Certificate for Secure Domain

![AWS ACM](resources/AWS%20ACM%20Manager.jpeg)

### Payment Connectors and SMS Webhooks

#### Stripe Payment

![Stripe](resources/Stripe%20Activity.jpeg)

![Stripe](resources/Stripe%20Payments.jpeg)

#### Twilio webhooks

![Twilio](resources/Twilio%20Webhooks.jpeg)

### Website Screenshots

#### Login Page

![login](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/4956c3fe-2e82-4b53-be9b-602f6652ac1f)

#### Dashboard

![image](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/b50d6133-cef5-4b99-a012-41746e5b86ff)

#### Create Products

![image](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/95ab24f8-4017-4abb-a43c-e22d6ce98590)

#### Create Discounts

![image](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/1deb1ebf-714e-4f0a-b054-023f879e4499)

#### Customer order selection via SMS

![SMS_ORDER1 (Small)](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/0a28cae6-8497-42d4-8329-05d0095843e1)
![Order2](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/ac6fa310-9684-4bf3-973b-96ecee85b1e5)
![Order3](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/9f0e9d8a-278d-4828-a12c-e3f022c20f8f)

#### Customer payment registration via Stripe

![SMS_Stripe Registration](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/f3ae5668-4d64-4732-8043-0679b4b8f291)
![SMS_Sripe_addCard](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/a254bbed-91b8-4dde-bda5-7f71e34077a6)
![SMS_Sripe_addCard_Saved (Small)](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/f027201b-f6f4-465b-b776-83ff82053fba)

#### Customer order payment via SMS

**Payment and order using SMS**

![Payment done and order placed](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/756f606f-38fb-4204-a959-fd33e6a74c30)

#### Order alert on merchant page

![Site_alerts](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/b0166db9-01af-4299-ae7c-d50e16a46f6a)

#### Customer Details

![Site_Customers](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/6603d878-4f3f-440d-a1d5-3fbf03c776a9)


### _**Backend APIs Request and Response**_

1. New Merchant onboard

 ```[https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/onboard]```

Add bearer token for request:
```
"request": 
{
	"auth": {
		"type": "bearer",
		"bearer": [
			{
				"key": "token",
				"value": "this-is-our-secret-key",
				"type": "string"
			}
		]
	},
	"method": "POST",
	"header": [],
	"body": {
		"mode": "raw",
		"raw": "{\r\n    \"firstName\": \"jaya\",\r\n    \"lastName\": \"krishna\",\r\n    \"email\": \"jayakrishna.thupili@sjsu.edu\",\r\n    \"businessName\": \"Peets Coffee\"\r\n}",
		"options": {
			"raw": {
				"language": "json"
			}
		}
	},
	"url": {
		"raw": "https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/onboard",
		"protocol": "https",
		"host": [
			"zj70v6aog3",
			"execute-api",
			"us-east-1",
			"amazonaws",
			"com"
		],
		"path": [
			"prod",
			"v1",
			"merchant",
			"onboard"
		]
	}
}
```
    

```
"response": [
    {
	"name": "Merchant onboard",
	"originalRequest": {
		"method": "POST",
		"header": [],
		"body": {
			"mode": "raw",
			"raw": "{\r\n    \"firstName\": \"jaya\",\r\n    \"lastName\": \"krishna\",\r\n    \"email\": \"jayakrishna.thupili@sjsu.edu\",\r\n    \"businessName\": \"Peets Coffee\"\r\n}",
			"options": {
				"raw": {
					"language": "json"
				}
			}
		},
		"url": {
			"raw": "https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/onboard",
			"protocol": "https",
			"host": [
				"zj70v6aog3",
				"execute-api",
				"us-east-1",
				"amazonaws",
				"com"
			],
			"path": [
				"prod",
				"v1",
				"merchant",
				"onboard"
			]
		}
	},
	"status": "OK",
	"code": 200,
	"_postman_previewlanguage": "json",
	"header": ["..."],
	"cookie": [],
	"body": "{\n    \"success\": true,\n    \"data\": {\n        \"id\": \"64615eab775481569b5337c9\",\n        \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDYxNWVhYjc3NTQ4MTU2OWI1MzM3YzkiLCJpYXQiOjE2ODQxMDI4Mjd9.StJK0PI_LGJmNl-_Yg4zQbt-URUhThrei2kWz8aIkxc\"\n    }\n}"
}]
```

2. Merchant Setup

 ```https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/setup```

```
"request": {
	"auth": {
		"type": "bearer",
		"bearer": [
			{
				"key": "token",
				"value": "this-is-our-secret-key",
				"type": "string"
			}
		]
	},
	"method": "POST",
	"header": [],
	"body": {
		"mode": "raw",
		"raw": "{\"id\":\"6461505db11bacf31447bddb\"}",
		"options": {
			"raw": {
				"language": "json"
			}
		}
	},
	"url": {
		"raw": "https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/setup",
		"protocol": "https",
		"host": [
			"zj70v6aog3",
			"execute-api",
			"us-east-1",
			"amazonaws",
			"com"
		],
		"path": [
			"prod",
			"v1",
			"merchant",
			"setup"
		]
	}
}
```

```
"response": [
{
	"name": "Merchant Setup",
	"originalRequest": {
		"method": "POST",
		"header": [],
		"body": {
			"mode": "raw",
			"raw": "{\"id\":\"6461505db11bacf31447bddb\"}",
			"options": {
				"raw": {
					"language": "json"
				}
			}
		},
		"url": {
			"raw": "https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/setup",
			"protocol": "https",
			"host": [
				"zj70v6aog3",
				"execute-api",
				"us-east-1",
				"amazonaws",
				"com"
			],
			"path": [
				"prod",
				"v1",
				"merchant",
				"setup"
			]
		}
	},
	"status": "OK",
	"code": 200,
	"_postman_previewlanguage": "json",
	"header": ["..."],
	"cookie": [],
	"body": "{\n    \"success\": true,\n    \"data\": {\n        \"user\": {\n            \"_id\": \"6461505db11bacf31447bddb\",\n            \"firstName\": \"jaya\",\n            \"lastName\": \"krishna\",\n            \"email\": \"jayakrishna.thupili@sjsu.edu\",\n            \"avatar\": \"e379afa006cbb724c93b8879364eba37\",\n            \"emailVerified\": false,\n            \"role\": \"ADMIN\",\n            \"status\": \"ACTIVE\",\n            \"type\": \"MERCHANT\",\n            \"address\": null,\n            \"merchant\": {\n                \"_id\": \"6461505db11bacf31447bdd8\",\n                \"stripeAccountId\": null,\n                \"stripeMetadata\": null,\n                \"squareMetadata\": null,\n                \"businessName\": \"Peets Coffee\",\n                \"subdomain\": null,\n                \"stripeEnabled\": false,\n                \"squareEnabled\": false,\n                \"productsSynced\": false,\n                \"ruleSetCreated\": false,\n                \"businessProfileCreated\": false,\n                \"businessPageViewed\": false,\n                \"processingFeesType\": \"MERCHANT\",\n                \"isB2B\": false,\n                \"createdAt\": \"2023-05-14T21:19:25.292Z\",\n                \"updatedAt\": \"2023-05-14T21:19:25.292Z\",\n                \"__v\": 0\n            },\n            \"customer\": null,\n            \"createdAt\": \"2023-05-14T21:19:25.345Z\",\n            \"updatedAt\": \"2023-05-14T21:19:25.345Z\",\n            \"__v\": 0\n        },\n        \"token\": \"<valueoftoken>\"\n    }\n}"
}
]
```

3. Create Product - Coffee

```https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/products```

Add x-access-token for request header:

```
"request": {
"method": "POST",
"header": [
	{
		"key": "x-access-token",
		"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		"type": "default"
	}
],
"body": {
	"mode": "raw",
	"raw": "{\r\n    \"title\": \"Coffee\",\r\n    \"description\": \"Latte\",\r\n    \"images\": [],\r\n    \"variations\": [\r\n        {\r\n            \"id\": \"#9Cjg1bWjpOhEaQwUk1R9K\",\r\n            \"name\": \"Regular\",\r\n            \"price\": 10\r\n        }\r\n    ],\r\n    \"timeUnits\": \"\",\r\n    \"timePeriod\": \"\"\r\n}",
	"options": {
		"raw": {
			"language": "json"
		}
	}
},
"url": {
	"raw": "https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/products",
	"protocol": "https",
	"host": [
		"zj70v6aog3",
		"execute-api",
		"us-east-1",
		"amazonaws",
		"com"
	],
	"path": [
		"prod",
		"v1",
		"merchant",
		"products"
	]
}
}
```

```
"response": [
{
	"name": "Create Product - Coffee",
	"originalRequest": {
		"method": "POST",
		"header": [
			{
				"key": "x-access-token",
				"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDYxNTA1ZGIxMWJhY2YzMTQ0N2JkZGIiLCJpYXQiOjE2ODQwOTkxNjZ9.TmtD094KoYkOmd0-5tNFXlf0pNu5KINs08JoQeBKCXU",
				"type": "default"
			}
		],
		"body": {
			"mode": "raw",
			"raw": "{\r\n    \"title\": \"Coffee\",\r\n    \"description\": \"Latte\",\r\n    \"images\": [],\r\n    \"variations\": [\r\n        {\r\n            \"id\": \"#9Cjg1bWjpOhEaQwUk1R9K\",\r\n            \"name\": \"Regular\",\r\n            \"price\": 10\r\n        }\r\n    ],\r\n    \"timeUnits\": \"\",\r\n    \"timePeriod\": \"\"\r\n}",
			"options": {
				"raw": {
					"language": "json"
				}
			}
		},
		"url": {
			"raw": "https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/products",
			"protocol": "https",
			"host": [
				"zj70v6aog3",
				"execute-api",
				"us-east-1",
				"amazonaws",
				"com"
			],
			"path": [
				"prod",
				"v1",
				"merchant",
				"products"
			]
		}
	},
	"status": "OK",
	"code": 200,
	"_postman_previewlanguage": "json",
	"header": ["..."],
	"cookie": [],
	"body": "{\n    \"success\": true,\n    \"message\": \"Product created successfully!\"\n}"
}
]
```
 
4. Get Products

```https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/products```

```
"request": {
"method": "GET",
"header": [
	{
		"key": "x-access-token",
		"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDYxNWVhYjc3NTQ4MTU2OWI1MzM3YzkiLCJpYXQiOjE2ODQxMDQ0NTZ9.OGdxuInq9cgNxWYM7Hr1NzJzvyF8FQExEelaZDjD1Rk",
		"type": "default"
	}
],
"url": {
	"raw": "https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/products",
	"protocol": "https",
	"host": [
		"zj70v6aog3",
		"execute-api",
		"us-east-1",
		"amazonaws",
		"com"
	],
	"path": [
		"prod",
		"v1",
		"merchant",
		"products"
	]
}}
```

```
"response": [
{
	"name": "Get Products",
	"originalRequest": {
		"method": "GET",
		"header": [
			{
				"key": "x-access-token",
				"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDYxNWVhYjc3NTQ4MTU2OWI1MzM3YzkiLCJpYXQiOjE2ODQxMDQ0NTZ9.OGdxuInq9cgNxWYM7Hr1NzJzvyF8FQExEelaZDjD1Rk",
				"type": "default"
			}
		],
		"url": {
			"raw": "https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/products",
			"protocol": "https",
			"host": [
				"zj70v6aog3",
				"execute-api",
				"us-east-1",
				"amazonaws",
				"com"
			],
			"path": [
				"prod",
				"v1",
				"merchant",
				"products"
			]
		}
	},
	"status": "OK",
	"code": 200,
	"_postman_previewlanguage": "json",
	"header": ["..."],
	"cookie": [],
	"body": "{\n    \"success\": true,\n    \"data\": [\n        {\n            \"_id\": \"64616545789ab4c4225ffc63\",\n            \"stripeProductId\": null,\n            \"stripePriceId\": null,\n            \"stripeMetadata\": null,\n            \"squareItemId\": null,\n            \"squareMetadata\": null,\n            \"squareCategory\": null,\n            \"title\": \"Mocha Latte\",\n            \"description\": \"Flavored Coffee \",\n            \"images\": [],\n            \"variations\": [\n                {\n                    \"id\": \"#jirDfwtpg83MWVb8VqLCT\",\n                    \"name\": \"Regular\",\n                    \"price\": 8\n                }\n            ],\n            \"type\": \"PRODUCT\",\n            \"status\": \"UN_PUBLISHED\",\n            \"price\": null,\n            \"forCC\": false,\n            \"discountRule\": null,\n            \"timeUnits\": \"\",\n            \"timePeriod\": \"\",\n            \"modifiers\": [],\n            \"products\": [],\n            \"merchant\": {\n                \"_id\": \"64615eab775481569b5337c7\",\n                \"stripeAccountId\": null,\n                \"stripeMetadata\": null,\n                \"squareMetadata\": null,\n                \"businessName\": \"Peets Coffee\",\n                \"subdomain\": null,\n                \"stripeEnabled\": false,\n                \"squareEnabled\": false,\n                \"productsSynced\": false,\n                \"ruleSetCreated\": true,\n                \"businessProfileCreated\": false,\n                \"businessPageViewed\": false,\n                \"processingFeesType\": \"MERCHANT\",\n                \"isB2B\": false,\n                \"createdAt\": \"2023-05-14T22:20:27.282Z\",\n                \"updatedAt\": \"2023-05-14T22:48:37.557Z\",\n                \"__v\": 0\n            },\n            \"hidden\": false,\n            \"deleted\": false,\n            \"createdAt\": \"2023-05-14T22:48:37.518Z\",\n            \"updatedAt\": \"2023-05-14T22:48:37.518Z\",\n            \"__v\": 0\n        }\n    ]\n}"
}]
```

5. Create Discounts

```https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/discounts```

```
"request": {
"method": "POST",
"header": [
	{
		"key": "x-access-token",
		"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDYxNWVhYjc3NTQ4MTU2OWI1MzM3YzkiLCJpYXQiOjE2ODQxMDQ0NTZ9.OGdxuInq9cgNxWYM7Hr1NzJzvyF8FQExEelaZDjD1Rk",
		"type": "default"
	}
],
"body": {
	"mode": "raw",
	"raw": "{\r\n    \"title\": \"20 % off\",\r\n    \"discountType\": \"PERCENTAGE\",\r\n    \"discountAmount\": \"10\",\r\n    \"discountSchedule\": {\r\n        \"startTime\": \"2023-05-14T22:49:25.671Z\",\r\n        \"endTime\": \"2023-05-15T06:59:59.999Z\"\r\n    },\r\n    \"products\": [\r\n        \"64616545789ab4c4225ffc63\"\r\n    ],\r\n    \"message\": \"Hi Peets Coffee Crew! Till the end of the day, our members get 20% off Mocha Latte. How many would you like?\\n\\n1 for one\\n2 for two\\n3 for three\"\r\n}",
	"options": {
		"raw": {
			"language": "json"
		}
	}
},
"url": {
	"raw": "https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/discounts",
	"protocol": "https",
	"host": [
		"zj70v6aog3",
		"execute-api",
		"us-east-1",
		"amazonaws",
		"com"
	],
	"path": [
		"prod",
		"v1",
		"merchant",
		"discounts"
	]
}}
```

```
"response": [
{
	"name": "New Request",
	"originalRequest": {
		"method": "POST",
		"header": [
			{
				"key": "x-access-token",
				"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDYxNWVhYjc3NTQ4MTU2OWI1MzM3YzkiLCJpYXQiOjE2ODQxMDQ0NTZ9.OGdxuInq9cgNxWYM7Hr1NzJzvyF8FQExEelaZDjD1Rk",
				"type": "default"
			}
		],
		"body": {
			"mode": "raw",
			"raw": "{\r\n    \"title\": \"20 % off\",\r\n    \"discountType\": \"PERCENTAGE\",\r\n    \"discountAmount\": \"10\",\r\n    \"discountSchedule\": {\r\n        \"startTime\": \"2023-05-14T22:49:25.671Z\",\r\n        \"endTime\": \"2023-05-15T06:59:59.999Z\"\r\n    },\r\n    \"products\": [\r\n        \"64616545789ab4c4225ffc63\"\r\n    ],\r\n    \"message\": \"Hi Peets Coffee Crew! Till the end of the day, our members get 20% off Mocha Latte. How many would you like?\\n\\n1 for one\\n2 for two\\n3 for three\"\r\n}",
			"options": {
				"raw": {
					"language": "json"
				}
			}
		},
		"url": {
			"raw": "https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/discounts",
			"protocol": "https",
			"host": [
				"zj70v6aog3",
				"execute-api",
				"us-east-1",
				"amazonaws",
				"com"
			],
			"path": [
				"prod",
				"v1",
				"merchant",
				"discounts"
			]
		}
	},
	"status": "OK",
	"code": 200,
	"_postman_previewlanguage": "json",
	"header": ["..."],
	"cookie": [],
	"body": "{\n    \"success\": true,\n    \"message\": \"Discount created successfully!\"\n}"
}]
```

6. Get Discounts

```https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/discounts```

```
"request": {
"method": "GET",
"header": [
	{
		"key": "x-access-token",
		"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDYxNWVhYjc3NTQ4MTU2OWI1MzM3YzkiLCJpYXQiOjE2ODQxMDQ0NTZ9.OGdxuInq9cgNxWYM7Hr1NzJzvyF8FQExEelaZDjD1Rk",
		"type": "default"
	}
],
"url": {
	"raw": "https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/discounts",
	"protocol": "https",
	"host": [
		"zj70v6aog3",
		"execute-api",
		"us-east-1",
		"amazonaws",
		"com"
	],
	"path": [
		"prod",
		"v1",
		"merchant",
		"discounts"
	]
}}
```

```
"response": [
{
	"name": "Get Discounts",
	"originalRequest": {
		"method": "GET",
		"header": [
			{
				"key": "x-access-token",
				"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDYxNWVhYjc3NTQ4MTU2OWI1MzM3YzkiLCJpYXQiOjE2ODQxMDQ0NTZ9.OGdxuInq9cgNxWYM7Hr1NzJzvyF8FQExEelaZDjD1Rk",
				"type": "default"
			}
		],
		"url": {
			"raw": "https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/merchant/discounts",
			"protocol": "https",
			"host": [
				"zj70v6aog3",
				"execute-api",
				"us-east-1",
				"amazonaws",
				"com"
			],
			"path": [
				"prod",
				"v1",
				"merchant",
				"discounts"
			]
		}
	},
	"status": "OK",
	"code": 200,
	"_postman_previewlanguage": "json",
	"header": ["..."],
	"cookie": [],
	"body": "{\n    \"success\": true,\n    \"data\": [\n        {\n            \"_id\": \"64616636789ab4c4225ffc85\",\n            \"title\": \"10 % off\",\n            \"discountType\": \"PERCENTAGE\",\n            \"discountAmount\": 10,\n            \"message\": \"Hi Peets Coffee Crew! Till the end of the day, our members get 10% off Mocha Latte. How many would you like?\\n\\n1 for one\\n2 for two\\n3 for three\",\n            \"discountSchedule\": {\n                \"startTime\": \"2023-05-14T22:49:25.671Z\",\n                \"endTime\": \"2023-05-15T06:59:59.999Z\"\n            },\n            \"products\": [\n                \"64616545789ab4c4225ffc63\"\n            ],\n            \"merchant\": \"64615eab775481569b5337c7\",\n            \"createdAt\": \"2023-05-14T22:52:38.230Z\",\n            \"updatedAt\": \"2023-05-14T22:52:38.230Z\",\n            \"__v\": 0\n        },\n        {\n            \"_id\": \"646166a7789ab4c4225ffc8c\",\n            \"title\": \"20 % off\",\n            \"discountType\": \"PERCENTAGE\",\n            \"discountAmount\": 10,\n            \"message\": \"Hi Peets Coffee Crew! Till the end of the day, our members get 20% off Mocha Latte. How many would you like?\\n\\n1 for one\\n2 for two\\n3 for three\",\n            \"discountSchedule\": {\n                \"startTime\": \"2023-05-14T22:49:25.671Z\",\n                \"endTime\": \"2023-05-15T06:59:59.999Z\"\n            },\n            \"products\": [\n                \"64616545789ab4c4225ffc63\"\n            ],\n            \"merchant\": \"64615eab775481569b5337c7\",\n            \"createdAt\": \"2023-05-14T22:54:31.993Z\",\n            \"updatedAt\": \"2023-05-14T22:54:31.993Z\",\n            \"__v\": 0\n        }\n    ]\n}"
}]
```

7. Get Payment Methods

```https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/payments/payment-methods/```

```
"request": {
"method": "GET",
"header": [
	{
		"key": "x-access-token",
		"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDYxNjdjMjc4OWFiNGM0MjI1ZmZjYTAiLCJpYXQiOjE2ODQxMDUxNTR9.QxP-uBM6AeXr7wVRj1GGq4S6GX7jzdx1_pVwbUbsTnM",
		"type": "default"
	}
],
"url": {
	"raw": "https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/payments/payment-methods/",
	"protocol": "https",
	"host": [
		"zj70v6aog3",
		"execute-api",
		"us-east-1",
		"amazonaws",
		"com"
	],
	"path": [
		"prod",
		"v1",
		"payments",
		"payment-methods",
		""
	]
}}
```

```
"response": [
{
"name": "Payment Methods",
"originalRequest": {
	"method": "GET",
	"header": [
		{
			"key": "x-access-token",
			"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDYxNjdjMjc4OWFiNGM0MjI1ZmZjYTAiLCJpYXQiOjE2ODQxMDUxNTR9.QxP-uBM6AeXr7wVRj1GGq4S6GX7jzdx1_pVwbUbsTnM",
			"type": "default"
		}
	],
	"url": {
		"raw": "https://zj70v6aog3.execute-api.us-east-1.amazonaws.com/prod/v1/payments/payment-methods/",
		"protocol": "https",
		"host": [
			"zj70v6aog3",
			"execute-api",
			"us-east-1",
			"amazonaws",
			"com"
		],
		"path": [
			"prod",
			"v1",
			"payments",
			"payment-methods",
			""
		]
	}
},
"status": "OK",
"code": 200,
"_postman_previewlanguage": "json",
"header": ["..."],
"cookie": [],
"body": "{\n    \"success\": true,\n    \"data\": {\n        \"cards\": [\n            {\n                \"id\": \"pm_1N7ntRDxxxxxxxxxxxx\",\n                \"brand\": \"visa\",\n                \"expiryMonth\": 12,\n                \"expiryYear\": 2024,\n                \"lastFourDigits\": \"4242\"\n            }\n        ]\n    }\n}"
}]
```


## API Testing using Postman



* **Create User**

Postman:
![image](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/47d677a4-d026-4c76-9fe4-a81079aaee86)

MongoDB Atlas:
![image](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/f77473c3-7a3e-4932-ab35-f9a56fb4847f)

* **Merchant Setup load**

Postman:
![image](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/97a1cf57-8620-4817-a7ea-4257db93ecfe)

* **Create Product**

Postman:
![image](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/72ff4f5e-97b1-4686-b164-84b9e40ee14d)

MongoDB Atlas:
![image](https://github.com/sjsu-4musks/text-to-pay-api/assets/111621706/d98f7903-ff7a-4d44-aa16-a5f12a09634f)
