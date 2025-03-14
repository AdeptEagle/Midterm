# Project Setup Guide

## **Prerequisites**
Ensure you have **Node.js** installed on your system before proceeding.

## **Installing Dependencies**
Run the following commands to install the required dependencies:

### **Global Dependencies**
```sh
npm install -g nodemon
```

### **Project Dependencies**
```sh
npm install express bcryptjs cors dotenv joi mysql2 typeorm reflect-metadata mysql2 dotenv
```

### **Development Dependencies**
```sh
npm install --save-dev @types/express @types/cors @types/bcryptjs @types/joi @types/node ts-node
```

## **Running the Application**
Start the development server using:
```sh
npm run dev
```

### **Database Initialization**
- The first run will create the database.
- Restart the server after database creation.
- Verify that you see the following logs:
  - **"Database successfully created"**
  - **"Running on Port 4000"**

Once these messages appear, you can proceed with API requests.

## **API Endpoints (Thunder Client Guide)**

### **Base URL:**
```
http://localhost:4000/users/
```

### **1. Create a User (POST)**
```http
POST http://localhost:4000/users/
```

#### **Request Body (JSON):**
```json
{
  "email": "testuser@example.com",
  "password": "securepassword123",
  "confirmPassword" : "securepassword123",
  "title": "Mr.",
  "firstName": "John",
  "lastName": "Doe",
  "Department": "IT",
  "Course": "Computer Science",
  "role": "User"
}
```

### **2. Retrieve All Users (GET)**
```http
GET http://localhost:4000/users/
```

### **3. Retrieve a Single User by ID (GET)**
```http
GET http://localhost:4000/users/{id}
```
_Replace `{id}` with the user’s ID._

### **4. Update a User (PUT)**
```http
PUT http://localhost:4000/users/{id}
```
_Replace `{id}` with the user’s ID._

#### **Request Body (JSON):**
```json
{
  "firstName": "Updated Name",
  "lastName": "Updated Last Name"
}
```

### **5. Delete a User (DELETE)**
```http
DELETE http://localhost:4000/users/{id}
```
_Replace `{id}` with the user’s ID._

## **Additional Notes**
- Ensure your MySQL server is running before starting the application.
- If database connection issues occur, check your `.env` file for correct database credentials.
- Use **Thunder Client** or **Postman** to test API endpoints efficiently.

For any issues, refer to the project documentation or reach out for support.

