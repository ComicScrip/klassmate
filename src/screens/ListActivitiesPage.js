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
import { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import API from '../APIClient';

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

export default function ListActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [numberOfSearchResults, setNumberOfSearchResults] = useState(0);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [error, setError] = useState('');
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const searchParams = {
    limit: 10,
    offset: 0,
    nameContains: '',
    ...queryString.parse(window.location.search),
  };
  const { limit, offset, nameContains } = searchParams;
  const currentPage = offset / limit + 1;
  const totalPages = Math.ceil(numberOfSearchResults / limit);

  const updateSearchUrl = (newParams) => {
    const clientQueryParams = queryString.stringify({
      ...searchParams,
      offset: 0, // reset page number to 1 everytime we change a search param
      ...newParams,
    });
    history.push(`/activities?${clientQueryParams}`);
  };

  const handleActivityClick = (id) => {
    history.push(`/activities/${id}`);
  };

  const handleError = (err) => {
    if (!axios.isCancel(err))
      setError('Something bad happened, sorry for the inconvenience');
  };

  const handleActivityDeletion = (id) => {
    // eslint-disable-next-line
    if (window.confirm('Are you sure ?')) {
      setLoadingActivities(true);
      API.delete(`/activities/${id}`)
        .then(() => {
          setActivities((activityList) =>
            activityList.filter((n) => n.id !== id)
          );
        })
        .catch(handleError)
        .finally(() => {
          setLoadingActivities(false);
        });
    }
  };

  const handleActivityEdition = (id) => {
    history.push(`/activities/edit/${id}`);
  };

  useEffect(() => {
    setLoadingActivities(true);

    const source = CancelToken.source();

    const APIQueryParams = {
      limit,
      offset,
      nameContains,
    };

    API.get(`/activities?${queryString.stringify(APIQueryParams)}`, {
      cancelToken: source.token,
    })
      .then((res) => {
        setActivities(res.data.items);
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
          setLoadingActivities(false);
      });
    return () => {
      source.cancel('request cancelled');
    };
  }, [location]);

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      <div className="flex justify-end pr-5 my-3">
        <Link to="/activities/edit/new">
          <Fab color="primary" className={classes.fab} aria-label="add">
            <AddIcon />
          </Fab>
        </Link>
      </div>
      <h2 className="text-3xl text-center mb-3">Activities</h2>
      <div className="m-5 ml-0 flex justify-between">
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            onChange={(e) => updateSearchUrl({ nameContains: e.target.value })}
            value={nameContains}
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
      </div>

      {loadingActivities ? (
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
                onChange={(e, value) =>
                  updateSearchUrl({ offset: parseInt(limit, 10) * (value - 1) })
                }
              />
            </div>
          )}

          <List>
            {activities.map(({ id, name }) => {
              return (
                <ListItem
                  key={id}
                  role={undefined}
                  button
                  onClick={() => handleActivityClick(id)}
                >
                  <ListItemText primary={name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => {
                        handleActivityEdition(id);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        handleActivityDeletion(id);
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
                onChange={(e) => updateSearchUrl({ limit: e.target.value })}
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
