import { useState, useEffect } from 'react';
import './ChuckNorris.css';

function ChuckNorris({ token, onLogout }) {
  const [fact, setFact] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getFact = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('http://localhost:3333/fact', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFact(data.fact);
        } else {
          setError(data.message || 'Failed to fetch fact.');
        }
      } catch (err) {
        setError('Could not reach the server. Make sure the back-end is running on port 3333.');
      } finally {
        setLoading(false);
      }
    };

    getFact();
  }, [token]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3333/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      // Log out locally even if the request fails.
    } finally {
      onLogout();
    }
  };

  return (
    <div className="chuck-norris">
      <h2 className="chuck-norris__title">Chuck Norris Fact</h2>

      {loading && <div className="chuck-norris__spinner" aria-label="Loading"></div>}

      {!loading && error && <p className="chuck-norris__error">{error}</p>}

      {!loading && !error && <p className="chuck-norris__fact">{fact}</p>}

      <button className="chuck-norris__button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default ChuckNorris;