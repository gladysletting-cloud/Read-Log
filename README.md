# 📚 Read-Log

Read-Log is a React-based book tracking application that helps users organize their reading, keep track of their books, and set yearly reading goals.

## 🎯 Project Overview

Read-Log provides a simple and user-friendly way to manage a personal reading library. Users can add books, update their reading status, delete books, and monitor their progress toward a yearly reading goal.

The project is designed to practice building a responsive web application using React and modern web development concepts.

## ✨ Features

- 🔐 User login and registration
- 📚 Add books to a personal library
- 🔄 Update book reading status
  - Want to Read
  - Reading
  - Finished
- 🗑️ Delete books
- 🔎 Search and manage books
- 🎯 Set a yearly reading goal
- 📊 Track progress toward the reading goal
- 📱 Responsive design for different screen sizes

## 🛠️ Technologies Used

- React
- JavaScript
- HTML
- TailwindCSS
- Vite
- Git & GitHub

## 📁 Project Structure

```text
read-log/
├── src/
│   ├── components/
│   ├── pages/
|   ├── services/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
├── package.json
├── index.html
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project:

```bash
cd read-log
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will then be available through the local development URL provided by Vite.

## 🔄 How It Works

### Books

Users can add a book by providing the book title, author, and reading status.

Each book can then be updated as the user progresses from:

```text
Want to Read → Reading → Finished
```

Users can also remove books from their library.

### Reading Goals

Users can set the number of books they want to finish during the year.

Read-Log calculates the user's progress based on the number of books marked as **Finished**.

For example:

```text
Finished: 5 books
Goal: 20 books

Progress: 25%
```

## 📡 API

The API/data storage layer will be documented here once the final API implementation is connected.

### Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/books` | Retrieve books |
| POST | `/books` | Add a new book |
| PATCH | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |
| GET | `/goals` | Retrieve reading goals |
| POST | `/goals` | Create a reading goal |
| PATCH | `/goals/:id` | Update a reading goal |

> Update these endpoints to match the actual API used by the final application.

## 🎨 Design

The Read-Log interface uses a simple, clean design focused on readability and ease of use.

The main interface includes:

- Navigation bar
- Reading statistics
- Book library
- Book management controls
- Reading goal progress
- Responsive layouts

The design was planned in Figma before implementation.

## 🌐 Deployment

Live application:

**[Add your deployed Read-Log URL here]**

## 📌 Future Improvements

Possible future features include:

- Book cover images
- Reading progress by page
- Book ratings and reviews
- Book categories
- Advanced search and filtering
- Reading history
- Monthly reading statistics
- User profiles
- Social authentication
- External books API integration

## 📄 License

This project is licensed under the MIT License.

## 👩‍💻 Author

**Gladys Letting**

Read-Log was developed as a React project to practice frontend development, API integration, and responsive web design.