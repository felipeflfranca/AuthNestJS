# Nest TypeScript Starter Project

This repository serves as a starting point for NestJS projects using TypeScript. Below are instructions for setting up the project, running Docker with a PostgreSQL database, and using seed commands to populate the database. Additionally, we provide examples of API requests for easy testing of implemented functionalities.

<br><p>
## Environment Setup

Make sure you have Docker installed on your system before getting started.

### Clone the repository to your local machine:
Make sure you have <a href="https://www.docker.com/get-started/" target="_blank">Docker</a> installed on your system before getting started.

#### 1. Clone the repository to your local machine
```bash
  git clone git@github.com:felipeflfranca/authentication-and-authorization-using-JWT-Nest.js.git
```
</p>


<br><p>
## Running

#### 1. Run the following command:
```bash
  docker-compose up -d
```

Now you have the development environment running with all routes responding

We implemented refresh token for jwt renewal and a black list with a trigger that deletes tokens that have already expired
</p>


<br><p>
## Creating and Running Seeds

We use seed commands to populate the database. To create a new seed, run the following command:

```bash
  npm run prisma:create-seed SeedName
```

For example:

```bash
  npm run prisma:create-seed CreateUserSeed
```

This will create a file named `seed_timestamp_SeedName.ts` in the `seeds` directory.

To execute all available seeds, use the following command:

```bash
  npm run prisma:seed
```
The provided examples generate a simple seed, but you can customize the seed logic as needed.
</p>


<br><p>
## Examples of API Requests

The application provides endpoints for authentication, user creation with roles, update, delete, and listing. Below are some examples of API requests:

### Authentication
#### POST Request for Login:

```bash
  POST /auth/login
Content-Type: application/json

{
  "username": "example_user",
  "password": "password123"
}
```
</p>


<br><p>

### Users
#### POST Request to Create User:

```bash
POST /user
Content-Type: application/json
Authorization: Bearer [TOKEN]

{
  "name": "User teste",
  "email": "admin@test.com.br"
  "password": "test"
  "roles": ["admin"]
}
```
</p>

<p>

#### PUT Request to Update User:

```bash
PUT /user/{id}
Content-Type: application/json
Authorization: Bearer [TOKEN]

{
  "name": "User teste",
  "email": "admin@test.com.br"
  "password": "test2"
  "roles": ["admin"]
}

```
</p>

<p>

#### DELETE Request to Delete User:


```bash
DELETE /user/{id}
Authorization: Bearer [TOKEN]
```
</p>

<p>

#### GET Request to Get All Users:

```bash
GET /user/all
Authorization: Bearer [TOKEN]
```
</p>

<p>

#### GET Request to Get User by ID:

```bash
GET /user/{id}
Authorization: Bearer [TOKEN]
```
</p>
<br><br>
I hope these instructions help with setting up and testing your project. If you encounter issues or have suggestions, please feel free to open an issue or contribute to development. Happy coding!
