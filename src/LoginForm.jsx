import { useState } from 'react';
import './LoginForm.css';

/**
 * LoginForm — controlled component.
 *
 * The field values live in the parent <App> component (this is what makes the
 * component "controlled"). App passes them in as props, along with the setters
 * used to update them and a setToken function used to report a successful login.
 *
 * Props:
 *   username     (string)              - current value of the username field
 *   password     (string)              - current value of the password field
 *   setUsername  (value => void)       - updates the username in App's state
 *   setPassword  (value => void)       - updates the password in App's state
 *   setToken     (token => void)       - called with the auth token on success
 */
function LoginForm({ username, password, setUsername, setPassword, setToken }) {
  // Local UI state (validation messages and request status) stays in this
  // component. Only the field values and the token are owned by App.
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [serverMessage, setServerMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Checks both fields and fills the errors object. Returns true if valid.
  const validate = () => {
    const nextErrors = { username: '', password: '' };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) {
      nextErrors.username = 'Username is required.';
    } else if (!emailPattern.test(username.trim())) {
      nextErrors.username = 'Please enter a valid email address (e.g., name@example.com).';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 4) {
      nextErrors.password = 'Password must be at least 4 characters.';
    }

    setErrors(nextErrors);
    return !nextErrors.username && !nextErrors.password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerMessage('');

    // Stop here and show errors if the input is not valid.
    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch('http://localhost:3333/login', {
        method: 'POST',
        headers: {
          // Required so ExpressJS can parse the JSON body.
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.uuid) {
        // Login succeeded — send the token up to the App component's state.
        setToken(data.uuid);
      } else {
        // Backend rejected the credentials — show its message.
        setServerMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      // Network/server problem (e.g. backend not running).
      setServerMessage('Could not reach the server. Make sure the back-end is running on port 3333.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <h2 className="login-form__title">Sign In</h2>

      <div className="login-form__field">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          placeholder="name@example.com"
          aria-invalid={errors.username ? 'true' : 'false'}
          onChange={(event) => {
            setUsername(event.target.value);
            // Clear this field's error as soon as the user edits it.
            if (errors.username) {
              setErrors((prev) => ({ ...prev, username: '' }));
            }
          }}
        />
        {errors.username && (
          <span className="login-form__error">{errors.username}</span>
        )}
      </div>

      <div className="login-form__field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          placeholder="Enter your password"
          aria-invalid={errors.password ? 'true' : 'false'}
          onChange={(event) => {
            setPassword(event.target.value);
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: '' }));
            }
          }}
        />
        {errors.password && (
          <span className="login-form__error">{errors.password}</span>
        )}
      </div>

      {serverMessage && (
        <p className="login-form__server-error">{serverMessage}</p>
      )}

      <button className="login-form__button" type="submit" disabled={submitting}>
        {submitting ? 'Signing in…' : 'Log In'}
      </button>
    </form>
  );
}

export default LoginForm;
