import MDEditor from '@uiw/react-md-editor';
import EditIcon from '@material-ui/icons/Edit';
import dayjs from 'dayjs';
import { CircularProgress, Fab, makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../APIClient';
import Avatar from '../components/Avatar';
import { CurrentUserContext } from '../contexts/currentUser';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 100,
  },
}));

export default function ShowNotePage() {
  const { canEditNote } = useContext(CurrentUserContext);
  const { id } = useParams();
  const [loadingNote, setLoadingNote] = useState('');
  const [error, setError] = useState('');
  const [note, setNote] = useState(null);
  const classes = useStyles();

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
    authorId,
    updatedAt,
    author: { firstName, avatarUrl },
  } = note;

  return (
    <div className="pt-5">
      {canEditNote(authorId) && (
        <Link to={`/notes/edit/${id}`}>
          <Fab color="primary" className={classes.fab} aria-label="add">
            <EditIcon />
          </Fab>
        </Link>
      )}

      <div className="flex justify-between items-center">
        <div title={firstName}>
          <Avatar avatarUrl={avatarUrl} size={40} />
        </div>
        <p className="text-sm">Last update : {dayjs().to(dayjs(updatedAt))}</p>
      </div>
      <h1 className=" text-center text-6xl mb-9 mt-5">{title}</h1>

      <MDEditor.Markdown source={content} />
    </div>
  );
}
