import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000/api/domains';

const initialForm = {
  domain: '',
  owner: '',
  expiresAt: '',
};

function App() {
  const [domains, setDomains] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function fetchData() {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Не вдалося отримати список доменів.');
      }

      const data = await response.json();
      setDomains(data);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.errors?.join(' ') || 'Не вдалося додати домен.');
      }

      setDomains((currentDomains) => [...currentDomains, responseData]);
      setFormData(initialForm);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page">
      <section className="panel">
        <h1>База доменів</h1>
        <p className="subtitle">Список доменів та форма для додавання нового запису.</p>

        <form className="form" onSubmit={handleSubmit}>
          <input
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            placeholder="Домен"
            required
          />

          <input
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            placeholder="Власник"
            required
          />

          <input
            type="date"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Збереження...' : 'Додати'}
          </button>
        </form>

        {error ? <p className="message message--error">{error}</p> : null}

        {isLoading ? (
          <p className="message">Завантаження даних...</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Домен</th>
                  <th>Власник</th>
                  <th>Дата закінчення</th>
                </tr>
              </thead>
              <tbody>
                {domains.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.domain}</td>
                    <td>{item.owner}</td>
                    <td>{item.expiresAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
