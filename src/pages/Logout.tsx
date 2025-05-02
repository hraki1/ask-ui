import { redirect } from "react-router-dom";

export function action() {
  // Check if the token exists before removing
  const token = localStorage.getItem("token");
  if (token) {
    localStorage.removeItem("token");
    console.log("Token removed");
  }

  const expiration = localStorage.getItem("expiration");
  if (expiration) {
    localStorage.removeItem("expiration");
    console.log("Expiration removed");
  }

  // Clear any auto-logout timeout (if set)
  // if (logoutTimeout) {
  //   clearTimeout(logoutTimeout);
  //   console.log("Logout timeout cleared");
  // }

  console.log("User logged out");

  // Redirect to the authentication page
  return redirect("/home/auth");
}
