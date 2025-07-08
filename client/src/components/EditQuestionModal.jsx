import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
  },
};

Modal.setAppElement('#root');

function EditQuestionModal({ isOpen, onRequestClose, question, onUpdate }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('single-line');

  useEffect(() => {
    if (question) {
      setTitle(question.title);
      setType(question.type);
    }
  }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(question.id, { title, type });
  };

  if (!question) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Edit Question"
    >
      <h2>Редактировать вопрос</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Текст вопроса"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
          <option value="single-line">Однострочный текст</option>
          <option value="multi-line">Многострочный текст</option>
          <option value="integer">Число</option>
          <option value="checkbox">Чекбокс</option>
        </select>
        <button type="submit">Сохранить</button>
        <button type="button" onClick={onRequestClose} style={{ marginLeft: '10px' }}>
          Отмена
        </button>
      </form>
    </Modal>
  );
}

export default EditQuestionModal;