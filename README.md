# Quantum Circuit Simulator Web Application

A full-stack **quantum circuit simulator web application** that allows users to **design, upload, download, store, and simulate quantum circuits** in an interactive browser-based environment. The application includes **secure user authentication**, **real-time communication**, and **persistent data storage**, built using modern web technologies and a MongoDB backend.

## Key Features
- User **sign-up and login** with **hashed & salted passwords**
- **Server-side session handling** with cookie-based authentication
- **Quantum circuit simulation** with real-time updates using **WebSockets**
- Upload and download quantum circuit files
- Persistent circuit storage using a **cloud-hosted MongoDB database**
- Encrypted user credentials and protected routes
- Responsive UI built with **HTML, CSS, and JavaScript**

## Server & Backend Functionality
- Custom **404 and 500 error handlers**
- Serves static assets (CSS, JS, images)
- Handles:
  - Route parameters
  - Query parameters
  - HTTP request bodies (form data & URL-encoded)
- Serves multiple **HTML forms** (authentication, circuit actions)
- Supports **file uploads and client-side downloads**
- Uses **AJAX (Fetch API)** and **WebSockets** for real-time interactions
- Middleware for authentication, validation, and request handling

## Templating & Rendering
- Server-rendered HTML using a templating engine
- Advanced templating features:
  - Conditional logic (if statements)
  - Loops
  - Template inheritance and reusable components

## Database & Security
- **MongoDB (cloud-hosted)** with full CRUD functionality
- Schema validation (server-side and/or Mongoose)
- Secure session storage (memory or database-backed)
- User authentication with encrypted credentials

## Additional Enhancements
- Modular and scalable code structure
- Organized navigation and UI layout
- SPA-like behavior through asynchronous requests
- Session-based tracking of user activity beyond login/logout
- Designed for extensibility and future feature expansion
