# Tickitz Backend App with NodeJS

This project was made by Muhammad Davinda Rinaldy in Kodacademy Training Program. This project uses NodeJS with ExpressJS framework to make backend app for tickitz, uses PostgreSQL for the SQL database and uses Redis for the NoSQL database.

Endpoint included in this project:
1. Auth (Register, Login, Forgot Password, Reset Password, Logout)
2. User (Update Profile/Credentials, Get Profile Data)
3. Movies (Get Movies, Get Detail Movie, Get Upcoming Movie, Get Genres, Get Directors, Get Casts, Add Genre, Add Director, Add Cast, Add Movie, Update Movie, Delete Movie) 
4. Transactions (Add Transaction, Get Transaction History, Get Reserved Seats, Get Payment Method, Add Payment Method, Get Sales Data)

## Endpoints Overview
| Method    | Endpoint | Description | Auth | Role |
| -------- | -------  | ------- | ------ | ------ |
| POST  | /auth/register | Create new user | No | - |
| POST  | /auth/login | Login | No | - |
| POST  | /auth/pass | Request to change password | No | - |
| PATCH  | /auth/pass | Change password with OTP | No | - |
| POST  | /auth/logout | Logout | Yes | User/Admin |
| PATCH  | /profile | Update user's data | Yes | User |
| GET  | /profile | Get user's data | Yes | User |
| GET  | /movies | Get all movies data | No | - |
| GET  | /movies/:id | Get one movie data | No | - |
| GET  | /movies/upcoming | Get all upcoming movie | No | - |
| GET  | /admin/genres | Get all genres | Yes | Admin |
| GET  | /admin/directors | Get all directors | Yes | Admin |
| GET  | /admin/casts | Get all casts | Yes | Admin |
| POST  | /admin/genres | Add new genre | Yes | Admin |
| POST  | /admin/directors | Add new director | Yes | Admin |
| POST  | /admin/casts | Add new cast | Yes | Admin |
| POST  | /admin/movies | Add new movie | Yes | Admin |
| PATCH  | /admin/movies/:id | Update movie's data | Yes | Admin |
| DELETE  | /admin/movies/:id | Delete movie | Yes | Admin |
| POST  | /admin/payment-methods | Add new payment method | Yes | Admin |
| GET  | /transactions/payment-methods | Get all payment methods | Yes | User/Admin |
| POST  | /transactions | Add new transactions | Yes | User |
| GET  | /transactions | Retrieve all transactions history per user | Yes | User |
| GET  | /transactions/seats | Retrieve all reserved seats for specific showtime | Yes | User |
| GET  | /admin/sales | Get sales data per movie | Yes | Admin |

## How to Run this Project

1. Create a new empty directory for the project and navigate into it
2. Clone this project
```
git clone https://github.com/mdavindarinaldy/fgo24-node-weeklytask.git .
```
3. Install dependencies
```
npm install
``` 
4. Run the project
```
npm run dev
```

## Database Schema

### SQL DB: Entity Relationship Diagram

```mermaid
erDiagram
    direction LR
    users {
        int id PK      
        string email
        string password
        enum role
        timestamp created_at
        timestamp updated_at
    }
    profiles {
        int id PK
        int id_user FK
        string name
        string phone_number
        string profile_picture
        timestamp created_at
        timestamp updated_at
    }
    movies {
        int id PK
        int created_by FK
        string title
        text synopsis
        date release_date
        decimal price 
        int runtime
        string poster
        string backdrop
        timestamp created_at
        timestamp updated_at
    }
    genres { 
        int id PK
        string name
        timestamp created_at
        timestamp updated_at
    }
    movies_genres {
        int id_genre PK,FK
        int id_movie PK,FK
        timestamp created_at
    }
    directors {
        int id PK
        string name
        timestamp created_at
        timestamp updated_at
    }
    movies_directors {
        int id_director PK,FK
        int id_movie PK,FK
        timestamp created_at
    }
    casts {
        int id PK
        string name
        timestamp created_at
        timestamp updated_at
    }
    movies_casts {
        int id_cast PK,FK
        int id_movie PK,FK
        timestamp created_at
    }
    payment_methods {
        int id PK
        string name
        timestamp created_at
        timestamp updated_at
    }
    transactions {
        int id PK
        int id_user FK
        int id_payment_method FK
        decimal total_amount
        timestamp created_at
    }
    showtimes {
        int id PK
        int id_movie FK
        string location
        string cinema
        date date
        time showtime
        timestamp created_at
    }
    transactions_detail {
        int id PK
        int id_transaction FK
        int id_showtime FK
        string seat
        timestamp created_at
    }
    movies ||--|{ movies_genres: has
    movies_genres }|--|| genres: belongs_to

    movies ||--|{ movies_directors: has
    movies_directors }|--|| directors: belongs_to

    movies ||--|{ movies_casts: has
    movies_casts }|--|| casts: belongs_to

    users ||--o{ transactions: creates
    users ||--o{ movies : manages
    transactions }o--|| payment_methods: with
    transactions ||--|{ transactions_detail: contains
    showtimes }o--|| movies : scheduled_for
    transactions_detail }o--|| showtimes: has

    users ||--|| profiles: has
```

### NoSQL DB (Redis):
- **otp**: Stores temporary OTP codes using the user's ID as the key, used for password reset verification.
- **blacklist_tokens**: Stores logged-out JWT tokens to prevent reuse before they expire.
- **caching**: Used to temporarily store frequently accessed data to improve read performance.

## Dependencies
This project is built using Node.js, so make sure to have **Node** installed on your machine. It uses **Express.js** as the main web framework, and includes the following dependencies:

### Runtime Dependencies
1. **express**: Web framework for building the API.
2. **sequelize**: Promise-based ORM for PostgreSQL.
3. **pg**: PostgreSQL client for Node.js.
4. **dotenv**: Loads environment variables from .env file.
5. **argon2**: Secure password hashing algorithm.
6. **jsonwebtoken**: For generating and verifying JWT tokens.
7. **ioredis**: Redis client used for OTP and token management.
8. **multer**: Middleware for handling file uploads.
9. **nodemailer**: For sending emails (e.g. OTP or notifications).
10. **express-validator**: For validating and sanitizing user input.
11. **morgan**: HTTP request logger middleware.
12. **uuid**: For generating unique IDs.

### Development Dependencies
1. **eslint**: For code linting and style checking.
2. **sequelize-cli**: CLI for managing Sequelize migrations and models.

## Basic Information
This project is part of training in Kodacademy Bootcamp Batch 24 made by Muhammad Davinda Rinaldy