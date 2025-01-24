README
Project Overview
This is a Meme Web Application developed using Node.js, Express, and EJS template engine. It allows users to view a table of memes fetched from an external API, search through memes, and view detailed meme information. Additionally, the application supports user authentication using Passport.js to ensure secure access to meme details.

Setup Instructions
Prerequisites
Ensure you have Node.js installed on your machine.
Download Node.js
Install NPM (Node Package Manager), which is bundled with Node.js.
Installation
Clone the Repository
bash
CopyInsert
git clone <repository-url>
cd <project-folder>
Install Dependencies
bash
CopyInsert in Terminal
npm install
The dependencies include:
express: A minimal and flexible Node.js web application framework.
ejs: Embedded JavaScript templates for dynamic HTML rendering.
passport: Middleware for user authentication.
passport-local: Local authentication strategy for Passport.
bootstrap@5.2.3: Front-end component library for responsive design.
jquery: JavaScript library for DOM manipulation and event handling.
connect-flash: Flash messages for Express applications.
Setup Configuration
Create a config.json file in the root directory with the following structure:
json
CopyInsert
{
  "apiUrl": "http://jss.restapi.co.za/memes"
}
Setup User Credentials
Create a users.json file in the data folder with the following structure:
json
CopyInsert
[
  { "username": "Josh", "password": "Josh1" },
  { "username": "FJ", "password": "FJ1" },
  { "username": "Student", "password": "Student1" }
]
Run the Application
bash
CopyInsert in Terminal
npm start
Open your browser and navigate to http://localhost:3000.
Project Structure
CopyInsert
project-folder/
├── public/
│   ├── stylesheets/
│   │   ├── home.css
│   │   ├── style.css
│   │   └── navbar.css
│   ├── js/
│   │   └── custom.js
│   └── images/
│       └── 404.png
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
└── README.md
Features
Meme Overview Page
Displays 20 memes fetched from the API.
Allows users to search for memes by name using a simple search bar.
Highlights viewed memes to help users keep track of what they've seen.
Meme Details Page
Displays detailed information about a selected meme, including its image, dimensions, and ID.
Provides a user-friendly interface for meme exploration.
User Authentication
Supports login and logout functionality using Passport.js.
Restricts access to detailed meme information for guest users, ensuring privacy and security.
Navbar
Includes a logo that redirects to the Meme Overview page.
Displays "Guest" or the logged-in username.
Shows Login/Logout button based on user status.
Testing
Use Postman or a similar tool to test the /login endpoint with the following:
URL: http://localhost:3000/login
Method: POST
Body (x-www-form-urlencoded):
CopyInsert
username: <username>
password: <password>
Verify:
Successful login redirects to /memes.
Invalid credentials display an error message.
Known Issues
Some dependencies may have vulnerabilities that cannot be resolved immediately. Refer to npm audit for details.
Further enhancements for error handling and user feedback are planned.
Future Enhancements
Add AJAX for search functionality to provide real-time search results.
Implement advanced error handling to improve user experience.
Add more robust logging mechanisms for better monitoring and debugging.
License
This project is licensed under the MIT License.