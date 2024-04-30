# Recipe Repository

## Overview
Recipe Repository is a full-stack application designed to help users search, view, and manage their favorite recipes. Built with React, Node.js, and PostgreSQL, the app features a secure and user-friendly interface that allows for easy access to a vast collection of recipes. Users can also add recipes to their favorites and generate reports based on their searches and activity.

## Technology Stack
- **Frontend**: React, Redux for state management, and Bootstrap for styling.
- **Backend**: Node.js with Express for the server, MongoDB for the database, and Mongoose for data modeling.
- **Authentication**: JWT for secure authentication.
- **Testing**: Jest for backend testing and React Testing Library for frontend tests.
- **Deployment**: Deployed using Netlify for the frontend and Heroku for the backend.

## Features
Recipe Search: Search for recipes based on ingredients, dish types, and more.
Favorite Recipes: Add and manage your favorite recipes in a personalized list.
Report Generation: Generate reports on user activity and recipe popularity.
Secure Access: User authentication to ensure secure access to personal favorites and settings.
Responsive UI: A user-friendly interface that works on both desktop and mobile devices.

## Local Setup
To set up and run this project locally, follow these steps:

### Prerequisites
- Node.js (v14 or later)
- PostgreSQL
- MongoDB (Local or Atlas)

## Getting Started
### Clone the Repository
To get started, clone the project repository to your local machine:
git clone https://github.com/yourusername/recipe-repository.git
cd recipe-repository

### Backend Setup
Navigate to the backend directory and install the required packages:
cd backend
npm install

### Environment Configuration
Create a .env file in the backend directory and update the following settings:
DATABASE_URL=your_database_url
API_KEY=your_spoonacular_api_key

### Database Setup
Run the following command to set up the database schema:
npx prisma migrate dev

### Frontend Setup
Navigate to the frontend directory and install the required packages:
cd ../frontend
npm install

### Start the Application
Start the React application using:
npm run dev


## Usage
Once the application is running, you can:
- Register/Login. Registration has validations.
- Search for recipes using the search bar.
- Add/Remove recipes to your favorites for easy access.
- Add/Edit Notes on favorited recipes
- View reports on your recipe interactions under the reports tab.


### Testing
To run the unit tests for the backend, use:
cd backend
npm test

