import React, { useState } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '450px',
    backgroundColor: '#333', 
    color: 'white',
    border: '1px solid #555',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

Modal.setAppElement('#root');

function HelpTicketModal({ isOpen, onRequestClose }) {
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState('Average');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      summary,
      priority,
      page: window.location.href, 
    });
    alert('Тикет создан (пока только в консоли)!');
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Create Support Ticket"
    >
      <h2>Новый запрос в поддержку</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Краткое описание проблемы</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            style={{ width: '100%', minHeight: '100px', background: '#555', color: 'white', border: '1px solid #777' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Приоритет</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            style={{ width: '100%', background: '#555', color: 'white', padding: '5px' }}
          >
            <option value="High">Высокий</option>
            <option value="Average">Средний</option>
            <option value="Low">Низкий</option>
          </select>
        </div>
        <button type="submit">Отправить тикет</button>
        <button type="button" onClick={onRequestClose} style={{ marginLeft: '10px' }}>
          Отмена
        </button>
      </form>
    </Modal>
  );
}

export default HelpTicketModal;