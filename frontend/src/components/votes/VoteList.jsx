import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVotes } from '../../store/votesSlice';
import VoteCard from './VoteCard';
import './VoteList.scss';

function VoteList() {
  const dispatch = useDispatch();
  const { items: votes, loading, error } = useSelector((state) => state.votes);

  useEffect(() => {
    dispatch(fetchVotes());
  }, [dispatch]);

  if (loading) return <div className="vote-list__loading">Загрузка...</div>;
  if (error) return <div className="vote-list__error">Ошибка: {error}</div>;

  return (
    <div className="vote-list">
      <h2>Активные голосования</h2>
      {votes.length === 0 ? (
        <p>Нет активных голосований</p>
      ) : (
        <div className="vote-list__grid">
          {votes.map((vote) => (
            <VoteCard key={vote.id} vote={vote} />
          ))}
        </div>
      )}
    </div>
  );
}

export default VoteList; 