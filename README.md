# Chalk Board

Chalk Board is a Realtime Todo application built with React, Firestore and Firebase Authentication.

## Features

- Realtime updates of todos using Firestore Realtime Database.
- Todo items are draggable for easy sorting.
- User authentication using Firebase authentication.
  - Email and Password Authentication.
  - Google Authentication.
- SignUp and Login functionality for users.
- Persistent storage of user todos, todos are not lost even after refreshing.
- Each todo item can be marked as completed, edited, or deleted.
- Service worker registration for PWA features.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Installation

- Make sure you have `Node.js` and `npm` installed.
- Set up Google Firebase - Refer to the Firebase Quickstart Guide https://firebase.google.com/docs/hosting/quickstart
- Have Firebase Authentication enabled.

1. Clone this repository:

    ```
    git clone https://git@github.com:markprodehl/chalk-board.git
    ```

2. Change into the directory:

    ```
    cd chalk-board
    ```

3. Install all dependencies:

    ```
    npm install
    ```

4. Firebase Configuration - In the src directory create a new `config` folder and inside of that make a file `firebaseConfig`. You will store all your environment variables in this file. 
**IMPORTANT**: Do not commit or share these secrets publicly. Be sure to include `firebaseConfig` in your `.gitignore` file like this `/src/config/firebaseConfig.js`

    ```
    const firebaseConfig = {
        apiKey: "<YOUR_API_KEY>",
        authDomain: "<YOUR_AUTH_DOMAIN>",
        databaseURL: "<YOUR_DATABASE_URL>",
        projectId: "<YOUR_PROJECT_ID>",
        storageBucket: "<YOUR_STORAGE_BUCKET>",
        messagingSenderId: "<YOUR_MESSAGING_SENDER_ID>",
        appId: "<YOUR_APP_ID>",
        measurementId: "<YOUR_MEASUREMENT_ID>"
    };
    export default firebaseConfig;
    ```

5. Run the application locally:

    ```
    npm start
    ```
    - The application will start running on http://localhost:3000

## Deployment

Link to deployed app: https://golden-to-do-list-462c7.web.app/

This project can be deployed on Google Hosting or any other static hosting you prefer. Refer to the respective platform's documentation on how to deploy a React application.

## Security

This project uses Firebase for user authentication and Firestore for database. All the security information including API keys are stored in a firebaseConfig.js which is not committed to the repository. Therefore, you must provide your own Firebase configuration for the project to work.

Note: Remember to never commit sensitive information to the repository. It should be stored in environment variables or a separate config file which is ignored by git.

## Contributing

Contributions are welcome! Please fork this repository and open a pull request to add enhancements or bug fixes.

## License

This project is open-sourced under the MIT License.


