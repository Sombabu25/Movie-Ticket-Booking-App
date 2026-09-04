# 🎬 Movie Ticket Booking App

A web-based application for booking movie tickets, built using **Express.js** and **Vanilla JavaScript**. Users can browse movies, select shows, and view their booking history.

---

## 🚀 Live Deployment

This application is deployed on Render: **[Movie Ticket Booking App](https://movie-ticket-booking-app.onrender.com/)**

---

## 🚀 Features

- 🎟️ Movie selection and booking functionality
- 🧑‍💻 Session-based user authentication
- 🕒 Booking history tracking with date and count
- 📦 Lightweight and clean interface with localStorage usage for quick movie detail handling
- 🔐 Secure user login and personalized experience
- 📱 Mobile-responsive design optimized for Android devices
- ℹ️ About and Contact pages with developer information

---

## 🛠️ Tech Stack

| Frontend  | Backend    | Other Tools      |
|-----------|------------|------------------|
| HTML/CSS  | Node.js    | localStorage     |
| JavaScript (Vanilla) | Express.js | Git & GitHub |
|           |            | session management (e.g., express-session) |

---

## 📁 Folder Structure

```
movie-ticket-booking-app/
│
├── public/          # Static HTML, CSS, JS files
│   ├── home.html    # Home page with movie listings
│   ├── movie.html   # Movie details page
│   ├── book.html    # Booking form
│   ├── login.html   # User login page
│   ├── register.html # User registration page
│   ├── profile.html # User booking history
│   ├── about.html   # About page
│   ├── contact.html # Contact page
│   ├── style.css    # Main stylesheet
│   └── movie.js     # Movie detail handling
├── server.js        # Main Express server file
├── package.json     # Project metadata and dependencies
├── .env             # Environment variables (not in git)
├── .env.example     # Environment variables template
├── render.yaml      # Render deployment configuration
├── .gitignore       # Git ignore rules
└── README.md        # Project documentation
```

---

## 🧪 How to Run Locally

1. **Clone the repository**  
   ```bash
   git clone https://github.com/Sombabu25/Movie-Ticket-Booking-App.git
   cd Movie-Ticket-Booking-App-main
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moviebooking
   SESSION_SECRET=your-secret-key-here
   PORT=5000
   ```

4. **Run the server**  
   ```bash
   npm start
   ```
   or
   ```bash
   node server.js
   ```

5. Open your browser at:  
   ```
   http://localhost:5000
   ```

---

## 🌐 Deployment on Render

This application is deployed on Render using the following configuration:

### Prerequisites
- MongoDB Atlas account for database
- Render account for hosting

### Deployment Steps

1. **Fork or clone this repository** to your GitHub account

2. **Set up MongoDB Atlas**
   - Create a free MongoDB Atlas cluster
   - Create a database user
   - Whitelist IP addresses (0.0.0.0/0 for Render)
   - Get your connection string

3. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` configuration
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `SESSION_SECRET`: A random secret string for session encryption
   - Click "Deploy Web Service"

4. **Access your app**
   - Render will provide a URL like `https://your-app-name.onrender.com`
   - The app will be live after deployment completes

### Environment Variables Required
- `MONGODB_URI`: MongoDB connection string
- `SESSION_SECRET`: Secret key for session management
- `PORT`: Port number (Render sets this automatically)

---

## 📌 To-Do / Upcoming Features

- [ ] Add movie seat selection UI
- [ ] Email confirmation for bookings
- [ ] Payment gateway integration
- [ ] Movie reviews and ratings system
- [ ] Advanced search and filtering options

---

## 👨‍💻 Developer

**Sombabu Patel**

- 📧 Email: sombabu25@outlook.com
- 📱 Phone: +91 8210787484
- 💼 LinkedIn: [linkedin.com/in/sombabu-patel](https://www.linkedin.com/in/sombabu-patel/)

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and open a pull request.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
