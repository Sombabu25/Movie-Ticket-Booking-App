window.addEventListener("DOMContentLoaded", () => {
  const movie = JSON.parse(localStorage.getItem("selectedMovie"));

  if (!movie) {
    // Redirect to home page instead of showing alert
    window.location.href = "/";
    return;
  }

  document.getElementById("moviePoster").src = movie.image;
  document.getElementById("movieTitle").textContent = movie.title;
  document.getElementById("movieRating").textContent = movie.rating;
  document.getElementById("movieVotes").textContent = movie.votes;
  document.getElementById("movieTags").textContent = movie.tags;
  document.getElementById("movieDuration").textContent = movie.duration;
  document.getElementById("movieGenre").textContent = movie.genre;
  document.getElementById("movieCert").textContent = movie.cert;
  document.getElementById("movieDate").textContent = movie.date;
  document.getElementById("movie-price").textContent = movie.price;

  // ✅ Show profile icon only if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const profileLink = document.querySelector("a[href='profile.html']");
  if (profileLink) {
    profileLink.style.display = isLoggedIn ? "inline-block" : "none";
  }
});
