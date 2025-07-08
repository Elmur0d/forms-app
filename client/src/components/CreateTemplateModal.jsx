import React, { useState } from 'react';
import Modal from 'react-modal';
import useTemplateStore from '../store/templateStore';

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

function CreateTemplateModal({ isOpen, onRequestClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createTemplate = useTemplateStore((state) => state.createTemplate);
  const [topic, setTopic] = useState('OTHER');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createTemplate({ title, description, topic });
    if (result.success) {
      setTitle('');
      setDescription('');
      setTopic('OTHER'); 
      onRequestClose(); 
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Create New Template"
    >
      <h2>Новый шаблон</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название шаблона"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <textarea
          placeholder="Описание (необязательно)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', height: '80px', marginBottom: '10px' }}
        />
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <label htmlFor="topic-select" style={{ marginRight: '10px' }}>Тема:</label>
          <select id="topic-select" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="EDUCATION">Образование</option>
            <option value="QUIZ">Викторина</option>
            <option value="POLL">Опрос</option>
            <option value="OTHER">Другое</option>
          </select>
        </div>
        <button type="submit">Создать</button>
        <button type="button" onClick={onRequestClose} style={{ marginLeft: '10px' }}>
          Отмена
        </button>
      </form>
    </Modal>
  );
}

export default CreateTemplateModal;