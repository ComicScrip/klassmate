import { CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../APIClient';

export default function ShowNotePage() {
  const { id } = useParams();
  const [loadingNote, setLoadingNote] = useState('');
  const [error, setError] = useState('');
  const [note, setNote] = useState(null);

  useEffect(() => {
    setLoadingNote(true);
    API.get(`/notes/${id}`)
      .then((res) => {
        setNote(res.data);
      })
      .catch(() => setError('Cannot show this note, sorry'))
      .finally(() => {
        setLoadingNote(false);
      });
  }, []);

  if (loadingNote) {
    return (
      <div className="flex justify-center items-center h-5/6">
        <CircularProgress />
      </div>
    );
  }
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!note) return null;

  const { title, content } = note;

  return (
    <div>
      <h2 className="text-center text-3xl mb-5">{title}</h2>
      <div>{content}</div>
    </div>
  );
}
