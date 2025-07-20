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
  const [tags, setTags] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState([]);


  useEffect(() => {
    if (!tags.includes(',')) { 
      const fetchSuggestions = async () => {
        if (tags.trim().length === 0) {
          setTagSuggestions([]);
          return;
        }
        try {
          const { data } = await axios.get(`${API_URL}/api/tags/search?term=${tags.trim()}`);
          setTagSuggestions(data);
        } catch (error) {
          console.error("Failed to fetch tag suggestions", error);
        }
      };
      fetchSuggestions();
    } else {
      setTagSuggestions([]);
    }
  }, [tags]);

  const handleSuggestionClick = (tagName) => {
    setTags(tagName + ', '); 
    setTagSuggestions([]); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    const result = await createTemplate({ title, description, topic });
    if (result.success) {
      setTitle('');
      setDescription('');
      setTopic('OTHER'); 
      setTags('');
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
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Теги (через запятую)</label>
          <input
            type="text"
            placeholder="например, работа, опрос, hr"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ width: '100%' }}
          />
          {tagSuggestions.length > 0 && (
            <ul style={{ position: 'absolute', background: '#555', listStyle: 'none', padding: '5px', margin: 0, width: '100%', zIndex: 10 }}>
              {tagSuggestions.map(tag => (
                <li key={tag.id} onClick={() => handleSuggestionClick(tag.name)} style={{ cursor: 'pointer', padding: '5px' }}>
                  {tag.name}
                </li>
              ))}
            </ul>
          )}
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