Online Library System
An online library system to manage books, users, and borrowings. Features include book checkout, check-in, overdue reminders, and user management with roles for admins, librarians, and readers.

How to Run the Project:
Clone the Repository
git clone https://github.com/Berr7Wa7ne/online-library.git
cd online-library

Install Dependencies:
Navigate to the backend directory and install dependencies:
cd backend
npm install

Start the backend using nodemon:
npx nodemon src/server.js

Navigate to the frontend directory and install dependencies:
cd frontend
npm install

Start the frontend using Vite:
npm run dev

Access the Application:
Open your browser and navigate to http://localhost:5173.

Features:
Central login system for both librarians and readers.
Librarians' accounts can only be created by a super admin.
Readers can register their accounts via a self-registration page.
Manage book checkout, check-in, and overdue reminders.
Role-based access control for admins, librarians, and readers.
