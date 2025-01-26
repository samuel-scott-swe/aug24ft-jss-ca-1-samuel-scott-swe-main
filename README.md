# Meme Web Application

## Project Overview
This is a Meme Web Application developed using Node.js, Express, and the EJS template engine. It allows users to:
- View a table of memes fetched from an external API.
- Search through memes.
- View detailed meme information if they are logged in
- Authenticate using Passport.js to ensure secure access to meme details.

---

## Setup Instructions

### Prerequisites
1. **Ensure Node.js is installed** on your machine.
   - [Download Node.js](https://nodejs.org/)
2. **NPM (Node Package Manager)** is bundled with Node.js, so no separate installation is required.

### Installation
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
   The dependencies include:
   - **express**: Minimal and flexible Node.js web application framework.
   - **ejs**: Embedded JavaScript templates for dynamic HTML rendering.
   - **passport**: Middleware for user authentication.
   - **passport-local**: Local authentication strategy for Passport.
   - **bootstrap@5.2.3**: Front-end component library for responsive design.
   - **jquery**: JavaScript library for DOM manipulation and event handling.
   - **connect-flash**: Flash messages for Express applications.

3. **Setup Configuration**:
   - Create a `API.json` file in the root directory with the following structure:
     ```json
     {
       "apiUrl": "http://jss.restapi.co.za/memes"
     }
     ```

4. **Setup User Credentials**:
   - Create a `users.json` file in the `data` folder with the following structure:
     ```json
     [
       { "username": "Josh", "password": "Josh1" },
       { "username": "FJ", "password": "FJ1" },
       { "username": "Student", "password": "Student1" }
     ]
     ```

5. **Run the Application**:
   Open terminal
   npm start
   ```
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## Project Structure
```
project-folder/
├── public/
│   ├── stylesheets/
│   │   ├── home.css
│   │   ├── style.css
│   │   └── navbar.css
│   ├── js/
│   │   └── custom.js
│   └── images/
│       ├── 404.png
│       ├── coffee_cafe_2.0.webp
│       ├── logo.png
│       ├── meme1.jpg
│       ├── meme2.jpg
│       └── meme3.jpg
├── views/
│   ├── partials/
│   │   ├── head.ejs
│   │   ├── navbar.ejs
│   │   └── scripts.ejs
│   ├── login.ejs
│   ├── memes.ejs
│   └── meme.ejs
├── routes/
│   ├── index.js
│   ├── memes.js
│   └── authentication.js
├── data/
│   ├── memes.json
│   └── users.json
├── app.js
├── package.json
├── package-lock.json
├── API.json
└── README.md

## Features

### Meme Overview Page
- Displays 20 memes fetched from the API.
- Allows users to search for memes by name using a simple search bar.
- Highlights viewed memes to help users keep track of what they've seen. (if they are logged in)

### Meme Details Page
- Displays detailed information about a selected meme, including its image, dimensions, and ID.
- Provides a user-friendly interface for meme exploration.

### User Authentication
- Supports login and logout functionality using Passport.js.
- Restricts access to detailed meme information for guest users, ensuring privacy and security.

### Navbar
- Includes a logo that redirects to the Meme Overview page.
- Displays "Guest" or the logged-in username.
- Shows a Login/Logout button based on user status.

---

## Testing
1. Use Postman or a similar tool to test the `/login` endpoint.
   - **URL**: `http://localhost:3000/login`
   - **Method**: `POST`
   - **Body (x-www-form-urlencoded)**:
     ```
     username: <username>
     password: <password>
     ```
2. Verify:
   - Successful login redirects to `/memes`.
   - Invalid credentials display an error message.

---

## Known Issues
- Some dependencies may have vulnerabilities that cannot be resolved immediately. Refer to `npm audit` for details.
- Further enhancements for error handling and user feedback are planned.

---

## Future Enhancements
- Add AJAX for search functionality to provide real-time search results.
- Implement advanced error handling to improve user experience.
- Add more robust logging mechanisms for better monitoring and debugging.

---

