import MDEditor from '@uiw/react-md-editor';
import dayjs from 'dayjs';
import { CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../APIClient';
import Avatar from '../components/Avatar';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

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

  const {
    title,
    content,
    updatedAt,
    author: { firstName, avatarUrl },
  } = note;

  return (
    <div className="pt-5">
      <div className="flex justify-between items-center">
        <div title={firstName}>
          <Avatar avatarUrl={avatarUrl} size={40} />
        </div>
        <p className="text-sm">Last update : {dayjs().to(dayjs(updatedAt))}</p>
      </div>
      <h1 className=" text-center text-6xl mb-7">{title}</h1>

      <MDEditor.Markdown source={content} />
    </div>
  );
}
