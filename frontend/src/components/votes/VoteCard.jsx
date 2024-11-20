import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { submitVote } from '../../store/votesSlice';
import './VoteCard.scss';

function VoteCard({ vote }) {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption) return;

    try {
      await dispatch(submitVote({ 
        voteId: vote.id, 
        selectedOption 
      })).unwrap();
      setSubmitted(true);
    } catch (error) {
      console.error('Ошибка голосования:', error);
    }
  };

  return (
    <div className="vote-card">
      <h3>{vote.title}</h3>
      <p>{vote.description}</p>
      
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {JSON.parse(vote.options).map((option) => (
            <div key={option} className="vote-card__option">
              <input
                type="radio"
                id={`${vote.id}-${option}`}
                name={`vote-${vote.id}`}
                value={option}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <label htmlFor={`${vote.id}-${option}`}>{option}</label>
            </div>
          ))}
          <button type="submit" disabled={!selectedOption}>
            Проголосовать
          </button>
        </form>
      ) : (
        <p className="vote-card__success">Спасибо за ваш голос!</p>
      )}
    </div>
  );
}

export default VoteCard; 