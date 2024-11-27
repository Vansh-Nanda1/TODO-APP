# TODO - APP

- A secure and efficient To-Do Management System, designed to handle task creation, management, and filtering, ensuring user-specific functionality and robust access control.

## **Features** 

- [User Authentication:](#User Authentication)
      - Passwords are hashed and securely stored using bcrypt.
      - Implemented **JWT-based authentication** for secure access to protected routes.
      - Middleware ensures only authenticated users can perform operations on their own tasks.

- [Role-Based Authorization:](#Role-Based Authorization)
      - Admin-specific APIs for managing users (fetch, update roles, delete).
      - Regular users can only manage their own tasks.

- [Cloudinary Integration:](#Cloudinary Integration)
      - Used **Cloudinary** for handling user profile pictures and signature uploads.
      - Supports seamless profile picture updates by first destroying the old image before uploading a new one.
      - Default profile picture setup when an image is removed.

- [To-Do Functionality:](#To-Do Functionality)
      - Created a To-Do model with the following fields: task, description, status, lastDate, and createdBy (referencing the user).
      - Utilized **Moment.js** for efficient date and time management.
      - APIs for:
         - Creating a new To-Do.
         - Fetching all To-Dos (with advanced filtering and pagination).
         - Fetching a single To-Do by ID.
         - Updating a To-Do (task details, status, last date).
         - Deleting a To-Do. 

- [ Advanced Middleware:](# Advanced Middleware)
    - **Authentication Middleware:** Validates JWTs, ensures user identity, and attaches user data to requests.
    - **Authorization Middleware:** Restricts access to admin-specific APIs.
    - **Error Handling Middleware:** Centralized error handling using **express-async-handler** for cleaner code.    

- [ File Upload Handling:](# File Upload Handling)
    - Custom Multer configuration to store temporary files with unique timestamps before uploading them to Cloudinary.
    - Automatically deletes local files post-upload to optimize storage.
- [User Profile Management:](#User Profile Management)
    - Update user details, including profile pictures and passwords.
    - Reset and update passwords securely.
    - Delete user profiles with all associated data.

      
# Tech Stack
  - **Backend:** Node.js, Express.js
  - **Database:** MongoDB
  - **Authentication:** JWT, bcrypt
  - **File Storage:** Cloudinary, Multer
  - **Libraries:**
       - **Moment.js:** For handling dates.
       - **express-async-handler:** For efficient error handling.
       - **cookie-parser:** To handle cookies for JWT storage and validation.



# Future Enhancements
  - Add reminder notifications for tasks nearing their deadlines.
  - Implement collaborative task sharing between users.
  - Add sorting and advanced search capabilities.