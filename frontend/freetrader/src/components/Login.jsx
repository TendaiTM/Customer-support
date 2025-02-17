import React, { useState } from "react"; //Import useState
import { useNavigate } from "react-router-dom"; //Import useNavigate
import "./Login.css"; // Ensure the correct file is imported

const Login = () => {
  const [email, setEmail] = useState(""); //Define state
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); //Initialize navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple client-side validation
    if (!email || !password) {
      setError("Both fields are required!");
      return;
    }

    setIsLoading(true);

    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess("Login successful!");
      setError("");
      setEmail("");
      setPassword("");

      // Redirect to HomePage after login
      navigate("/Homepage");
    }, 2000);
  };

  const handleRegisterRedirect = () => {
    navigate("/RegistrationPage");
  };

  return (
    <div className="container2">
      <div className="card1">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input"
            />
          </div>
          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
        <button onClick={handleRegisterRedirect} className="button-register">
          Don't have an account? Register here
        </button>
      </div>
    </div>
  );
};

export default Login;
