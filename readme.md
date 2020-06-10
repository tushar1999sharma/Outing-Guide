
# Outing Guide

> Web app where user can share their experience of their trip of tourist spots. It includes feature like authentication, authorization, rating, comments, fuzzy search, in app notification and follow - unfollow system

  

## Table of contents

*  [Installation](#installation)

*  [Tech Stack](#tech-stack)

*  [Features](#feature)

*  [Routes](#server-routes)

*  [Screenshots](#screenshots)

  

## Installation

  


- Clone the repository using `git clone` and then change the directory to root of the project

```
git clone 
cd Outing-guide
```
- Install [mongodb](https://www.mongodb.com/)

- Start database
```
> mongod
```

- Use npm to install dependencies for the project.

```
> npm install
```

- Create .env file in root folder and add necessary credentials with variables given below.

```bash

CLOUDINARY_API_KEY='cloudinary api key'
CLOUDINARY_API_SECRET='cloudinary api secret'

```

- Run the program 

```
> node app.js
```

- Now navigate to http://localhost:3000

***
  

## Tech Stack

> Backend

* Node js

* Mongoose

> Frontend

* Html

* Css

* Bootstrap


## Features

* User can register themselves using Register Form and can login themselves using Login Form. Authentication is implemented using mongoose local strategy of passport js. Users details will be stored in the user collection of the database.

* User can post new blog, edit and delete.

* User can comment on others blog and they can also edit and delete it.

* User can rate blog. 

* User can follow - unfollow each other.

* User will get in app notification whenever someone follow them or user they are following post new blog.

* User can search post with post name or city name.

* Moment js is used to evaluate time of post and comment from current time.

* Avatar image and all image posted by users are uploaded on cloudinary.
  

## Server Routes

  

*  `{baseURL}/spots`

	* This will show all available posts


*  `{baseURL}/login`

	* If the Host is logged in, then this will redirect to `/spot`.

	* Login form will be rendered using the GET method of request.

	* Login form will be submitted and validated using the Post method of request.
	
	
*  `{baseURL}/register`

	* If the Host is logged in, then this will redirect to `/home`.

	* Register form will be rendered using the GET method of request.

	* Register form will be submitted and validated using the Post method of request.
	
	*   We use Mongoose Local Strategy for authentication 
  
  
*  `{baseURL}/logout`

	 * If the Host is logged in, then this will logout host and redirect to `/spot`.

	* If the Host is logged off, then this will redirect to `/spot`.


*  `{baseURL}/checkin`

  

* If the Host is logged in, then this will redirect to `/home`.

* Check In form will be rendered using the GET method of request.

* Check In form will be submitted and validated using the Post method of request.

* Email and Sms will be sent through flask-mail and Twilio services.

  

## ScreenShots

  

> Home Page

  

![ScreenShot](/screenshots/home.png)

  

> Check-In Page (Available hosts can be selected from the dropdown)

  

![ScreenShot](/screenshots/visitor_checkin.png)

  

> Check-Out Page

  

![ScreenShot](/screenshots/visitor_checkout.png)

  

> Host Login Page

  

![ScreenShot](/screenshots/host_login.png)

  

> Host Register Page

  

![ScreenShot](/screenshots/host_register.png)

  

> Visitor Details Page (the host can see details of his current and past visitors)

  

![ScreenShot](/screenshots/visitors_details.png)
