import React, { useState, useEffect } from 'react';

function App() {
  const [topics, setTopics] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newTopicName, setNewTopicName] = useState('');
  const [fieldKey, setFieldKey] = useState('');
  const [fieldValue, setFieldValue] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/topics')
      .then(res => res.json())
      .then(data => setTopics(data));
  }, [selected]);

  const createTopic = async () => {
    if (!newTopicName) return;
    const res = await fetch('http://localhost:4000/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTopicName })
    });
    if (res.ok) {
      setNewTopicName('');
      const topic = await res.json();
      setTopics(prev => [...prev, topic]);
      setSelected(null);
    }
  };

  const addField = async () => {
    if (!selected || !fieldKey) return;
    const res = await fetch(`http://localhost:4000/api/topics/${selected.id}/fields`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: fieldKey, value: fieldValue })
    });
    if (res.ok) {
      const updated = await res.json();
      setSelected(updated);
      setFieldKey('');
      setFieldValue('');
    }
  };

  // Удалить топик
    const deleteTopic = async (id) => {
    const res = await fetch(`/api/topics/${id}`, { method: 'DELETE' });
    if (res.ok) {
        setTopics(prev => prev.filter(t => t.id !== id));
        if (selected?.id === id) setSelected(null);
    }
    };

    // Удалить поле
    const deleteField = async (topicId, key) => {
    const res = await fetch(`/api/topics/${topicId}/fields/${key}`, { method: 'DELETE' });
    if (res.ok && selected && selected.id === topicId) {
        const updatedFields = { ...selected.fields };
        delete updatedFields[key];
        setSelected({ ...selected, fields: updatedFields });
    }
    };

  return (
    <div className="app-container">
      <h1>Менеджер аккаунтов</h1>
      <div className="topic-creator">
        <input
          placeholder="Название топика"
          value={newTopicName}
          onChange={e => setNewTopicName(e.target.value)}
        />
        <button onClick={createTopic}>Создать</button>
      </div>
      <div className="content">
        <ul className="topic-list">
        {topics.map(t => (
            <li key={t.id} style={{ display: 'flex', alignItems: 'center' }}>
            <span
                onClick={() => setSelected(t)}
                style={{ flexGrow: 1, cursor: 'pointer' }}
            >
                {t.name}
            </span>
            <button
                onClick={() => deleteTopic(t.id)}
                aria-label="Удалить топик"
            >
                ×
            </button>
            </li>
        ))}
        </ul>
        <div className="details">
          {selected ? (
            <>
              <h2>{selected.name}</h2>
              <ul>
                {Object.entries(selected.fields).map(([k, v]) => (
                  <li key={k}><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
              <div className="field-creator">
                <input
                  placeholder="Имя поля"
                  value={fieldKey}
                  onChange={e => setFieldKey(e.target.value)}
                />
                <input
                  placeholder="Значение"
                  value={fieldValue}
                  onChange={e => setFieldValue(e.target.value)}
                />
                <button onClick={addField}>Добавить</button>
              </div>
            </>
          ) : (
            <p>Выберите топик</p>
          )}
        </div>
      </div>
    </div>
);
}

export default App;