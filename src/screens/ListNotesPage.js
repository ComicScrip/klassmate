import {
  CircularProgress,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import API from '../APIClient';

const { CancelToken } = axios;

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default function ListNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [error, setError] = useState('');
  const classes = useStyles();
  const history = useHistory();

  const handleNoteClick = (id) => {
    history.push(`/notes/${id}`);
  };

  const handleError = (err) => {
    if (!axios.isCancel(err))
      setError('Something bad happened, sorry for the inconvenience');
  };

  const handleNoteDeletion = (id) => {
    // eslint-disable-next-line
    if (window.confirm('Are you sure ?')) {
      setLoadingNotes(true);
      API.delete(`/notes/${id}`)
        .then(() => {
          setNotes((noteList) => noteList.filter((n) => n.id !== id));
        })
        .catch(handleError)
        .finally(() => {
          setLoadingNotes(false);
        });
    }
  };

  const handleNoteEdition = (id) => {
    history.push(`/notes/edit/${id}`);
  };

  useEffect(() => {
    const source = CancelToken.source();
    setLoadingNotes(true);
    API.get('/notes', { cancelToken: source.token })
      .then((res) => setNotes(res.data))
      .catch(handleError)
      .finally(() => {
        if (
          !(
            source.token.reason &&
            source.token.reason.message === 'request cancelled'
          )
        )
          setLoadingNotes(false);
      });
    return () => {
      source.cancel('request cancelled');
    };
  }, []);

  return (
    <div>
      <div className="flex justify-end pr-5 my-3">
        <Link to="/notes/edit/new">
          <Fab color="primary" className={classes.fab} aria-label="add">
            <AddIcon />
          </Fab>
        </Link>
      </div>
      <h2 className="text-3xl text-center mb-3">Notes</h2>
      {error && <Alert severity="error">{error}</Alert>}
      {loadingNotes ? (
        <div className="flex justify-center  pt-3">
          <CircularProgress />
        </div>
      ) : (
        <List>
          {notes.map(({ id, title }) => {
            return (
              <ListItem
                key={id}
                role={undefined}
                button
                onClick={() => handleNoteClick(id)}
              >
                <ListItemText primary={title} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      handleNoteEdition(id);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => {
                      handleNoteDeletion(id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      )}
    </div>
  );
}
