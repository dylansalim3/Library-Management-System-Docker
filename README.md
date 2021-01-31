# Primary School Library Management System Frontend
## Description
Through the Primary School Library management systems, librarians can keep track of the books and their checkouts, as well as members’ profiles. The Primary School Library management systems also involve maintaining the database for entering new books and recording books that have been borrowed with their respective due dates. The library system also provides an easy way to register user accounts, user accounts can be registered using csv files and normal form registrations. 
<br> [Link](https://github.com/dylansalim3/Library-Management-System-Frontend) to Frontend
<br> [Link](https://github.com/dylansalim3/Library-Management-System-Backend) to Backend

## Project Objective
The project objective is to develop a web-based application that provides students with the ease of accessing library catalogue online and provides librarians with the ease of managing the large number of library catalogue and handles day-to-day tasks, such as borrow, return and reserve books. The other purpose of this project is to encourage reading habits among primary school students by providing an user friendly library management system that is accessible anywhere and anytime.

## Dependencies
### Frontend Dependencies
➔	React (Front-End View Library)
➔	Axios (HTTP client)
➔	Material-UI (UI Framework)
➔	React Hooks Form (Form Library)
➔	React Barcode (Generate barcode)
➔	Jwt-Decode (Decode JWT token from the backend)
➔	Date-fns (JS Date Utility Library)
➔   Socket.io-client (Socket Library)

### Backend Dependencies
➔	Node JS (Execution environment)
➔	Express JS (Node JS web framework)
➔	Sequelize (ORM tool)
➔	MySQL2 (MySQL connector)
➔	Mutler (Upload Image)
➔	BCrypt (Hashing algorithm)
➔	Json Web Token, JWT (To transfer verified user credential)
➔	NodeMailer (To send email)
➔	CSV Parser (Parse CSV files)
➔	Cors (Handles cross origin requests)

## Environment File
### Frontend env
REACT_APP_SERVER_BASE_URL=<Frontend_Domain> <br>
REACT_APP_WEB_BASE_URL=<Backend_Domain>

### Backend env
NODE_ENV=<development_or_production> <br>
EMAIL_SERVICE=gmail <br>
CLIENT_ID=<Google_API_CLIENT_ID> <br>
CLIENT_SECRET=<Google_API_CLIENT_SECRET> <br>
REFRESH_TOKEN=<Google_API_REFRESH_TOKEN> <br>
SENDER_EMAIL=<EMAIL> <br>
<br>
DB_TABLE_NAME=fyp_primary_school_management <br>
DB_USERNAME=<USERNAME> <br>
DB_PASSWORD=password <br>
DB_HOST=<DB_HOST> <br>
DB_PORT=<DB_PORT> <br>
DB_DIALECT=mysql <br>
<br>
PUBLIC_VAPID_KEY=<br>
PRIVATE_VAPID_KEY=<br>
<br>
FRONTEND_URL=<FRONTEND_URL><br>

# Instructions
1. Install docker and run "docker-compose up --build -d"
2. Using a MySQL Client, connect to the database via localhost:3306, username = root, password = password
Create a database named "fyp_primary_school_management"
3. Re-build the docker images using the command "docker-compose up --build -d"
4. All of the database fields should be auto generated by Sequelize
5. Setup the database fields(refer to #1)
6. The client web application is started at http://localhost:3000


## Setup the database fields:
1. Go to the backend folder, run all the SQL command available in the "createData.sql"
2. Insert the following command to the MySQL client
```
	USE "fyp_primary_school_management";
	INSERT INTO role (id, role) VALUES (1, 'admin'), (2, 'student'), (3, 'librarian'), (4, 'teacher');

	ALTER TABLE book AUTO_INCREMENT = 1001;
	ALTER TABLE book_detail AUTO_INCREMENT = 1001;

	ALTER TABLE BOOK_DETAIL ADD COLUMN barcode_path varchar(255);
```
3. Add one data into the settings table.

# IMPORTANT
- Frontend exposed port = 3000
- Backend exposed port = 3000
- MySQL exposed port = 3300