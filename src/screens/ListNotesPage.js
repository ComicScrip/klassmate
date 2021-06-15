import {
  CircularProgress,
  Fab,
  fade,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import Alert from '@material-ui/lab/Alert';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import queryString from 'query-string';
import { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import API from '../APIClient';
import { CurrentUserContext } from '../contexts/currentUser';

const { CancelToken } = axios;

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function ListNotesPage() {
  const { profile } = useContext(CurrentUserContext);
  const [allUsers, setAllUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [numberOfSearchResults, setNumberOfSearchResults] = useState(0);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [error, setError] = useState('');
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const searchParams = {
    limit: 10,
    offset: 0,
    authorId: '',
    titleOrContentContains: '',
    ...queryString.parse(window.location.search),
  };
  const { limit, offset, titleOrContentContains, authorId } = searchParams;
  const currentPage = offset / limit + 1;
  const totalPages = Math.ceil(numberOfSearchResults / limit);

  const updateSearchUrl = (params) => {
    const clientQueryParams = queryString.stringify(params);
    history.push(`/notes?${clientQueryParams}`);
  };
  const setCurrentPage = (pageNum) => {
    updateSearchUrl({
      ...searchParams,
      offset: parseInt(limit, 10) * (pageNum - 1),
    });
  };

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
    setLoadingNotes(true);

    const source = CancelToken.source();

    const APIQueryParams = {
      limit,
      offset,
      titleOrContentContains,
      authorId,
    };

    API.get(`/notes?${queryString.stringify(APIQueryParams)}`, {
      cancelToken: source.token,
    })
      .then((res) => {
        setNotes(res.data.items);
        setNumberOfSearchResults(res.data.totalMatches);
      })
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
  }, [location]);

  useEffect(() => {
    API.get('/users').then((res) => setAllUsers(res.data));
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;

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
      <div className="m-5 ml-0 flex justify-between">
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            onChange={(e) =>
              updateSearchUrl({
                ...searchParams,
                titleOrContentContains: e.target.value,
                offset: 0,
              })
            }
            value={titleOrContentContains}
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>

        <Select
          value={authorId}
          onChange={(e) =>
            updateSearchUrl({
              ...searchParams,
              authorId: e.target.value,
              offset: 0,
            })
          }
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="">
            <em>From everyone</em>
          </MenuItem>
          <MenuItem value={profile && profile.id}>
            <em>Mine</em>
          </MenuItem>

          {allUsers
            .filter((u) => u.id !== profile.id)
            .map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {`of ${user.firstName} ${user.lastName}`}
              </MenuItem>
            ))}
        </Select>
      </div>

      {loadingNotes ? (
        <div className="flex justify-center  pt-3">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="my-5 flex justify-end gap-2 mr-5">
            <em>{numberOfSearchResults}</em> items match your search
          </div>

          {totalPages > 1 && (
            <div className="my-5 flex justify-end">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, value) => setCurrentPage(value)}
              />
            </div>
          )}

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
          {numberOfSearchResults !== 0 && (
            <div className="my-5 flex justify-end gap-2 pb-10">
              Display
              <Select
                value={limit}
                onChange={(e) =>
                  updateSearchUrl({
                    ...searchParams,
                    limit: e.target.value,
                    offset: 0,
                  })
                }
                displayEmpty
                inputProps={{ 'aria-label': 'Per page' }}
              >
                {[10, 20, 50].map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
              items max. per page
            </div>
          )}
        </>
      )}
    </div>
  );
}
