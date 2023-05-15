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

![](images/ArchitectDiagram.png)

## UML Diagram

![](images/UMLDiagram.png)

## [Project Board] TBD

### Pre-requisites Set Up

###### Frontend

Pre-requisites:

```
Node.js -Version 12 https://nodejs.org/en/

Frontend Technologies: NPM,HTML, SCSS, Angular CLI, Angular 10, Angular-material, Bootstrap, JEST.

To run Angular application in local:

Run following commands in ‘/UI/hire-my-services/’ 

1)npm install -g @angular/cli
2)npm install
2)ng serve

Server will be running on ‘http://localhost:4200’ 
```

###### Backend APIs

* Requirements:

    set following environment variables values:

    ```
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", None)
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", None)
    AWS_REGION = os.getenv("AWS_REGION", None)
    COGNITO_USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID", None)
    COGNITO_APP_CLIENT_ID = os.getenv("COGNITO_APP_CLIENT_ID", None)
    S3_BUCKET = os.getenv("S3_BUCKET", None)
    S3_URL = os.getenv("S3_BUCKET", None)
    CLOUD_FRONT_URL = os.getenv("CLOUD_FRONT_URL", None)
    ```

    ```pip3 install -r requirements.txt```

    ```python3 flask_app.py```

### AWS Configuration Screenshots

#### AWS Cognito

![](images/Cognito.png)

#### AWS Amplify

![](images/amplify.png)

#### AWS S3

![](images/S3.png)

#### AWS CloudFront

![](images/CloudFront.png)

#### AWS DynamoDB

![](images/DynamoDB.png)

#### AWS Certificate Manager

![](images/Certificate.jpeg)

#### AWS Route53

![](images/Route53.jpeg)

### Automate Deployment

#### Login Page

![](images/login.png)

#### Jenkins Dashboard

![](images/dashboard1.png)

![](images/dashboard.png)

#### Pipeline Configuration

![](images/pipeline1.png)

![](images/pipeline2.png)

![](images/pipeline3.png)

![](images/pipeline4.png)

#### Build History

![](images/buildhistory.png)

#### Console Output

![](images/output1.png)

![](images/output2.png)

![](images/output3.png)

#### Git Webhook

![](images/gitwebhook.png)

![](images/webhook2.png)

### Website Screenshots

#### Login

![](WebsiteScreenshots/login.png)

#### Customer Register

![](WebsiteScreenshots/register1.png)

#### Provider Register

![](WebsiteScreenshots/register2.png)

#### Customer Home Page(List of services)

![](WebsiteScreenshots/services.png)

![](WebsiteScreenshots/services2.png)

#### Service Providers Page

![](WebsiteScreenshots/providerList.png)

#### Book Appointment

![](WebsiteScreenshots/bookAppointment.png)

#### Customer Appointments

![](WebsiteScreenshots/customerAppointments1.png)

![](WebsiteScreenshots/customerAppointments2.png)

#### Review Provider

![](WebsiteScreenshots/review.png)

#### Provider Reviews

![](WebsiteScreenshots/customerReviewSubmitted.png)

#### Customer Edit Profile

![](WebsiteScreenshots/customerProfile.png)

#### Provider Appointments

![](WebsiteScreenshots/providerAppointments.png)

#### Provider Profile

![](WebsiteScreenshots/providerProfile.png)

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
