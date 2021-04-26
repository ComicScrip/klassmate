import {
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import API from '../APIClient';
import GroupList from '../components/GroupList';

function makeGroups(array, numberOfGroups) {
  const groups = new Array(numberOfGroups).fill().map(() => []);
  let currentGroupIndex = 0;
  array.forEach((item) => {
    groups[currentGroupIndex].push(item);
    currentGroupIndex += 1;
    if (currentGroupIndex === groups.length) currentGroupIndex = 0;
  });
  return groups;
}

export default function CreateGroupsPages() {
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [numberOfGroupsToCreate, setNumberOfGroupsToCreate] = useState(2);
  const [groupOption, setGroupOption] = useState('Aléatoire');

  const changeGroupOption = (event) => {
    setGroupOption(event.target.value);
  };

  useEffect(() => {
    setStudentsLoading(true);
    API.get('/students')
      .then((res) => {
        setStudents(res.data);
      }) // eslint-disable-next-line
      .catch(console.error)
      .finally(() => {
        setStudentsLoading(false);
      });
  }, []);

  const safelyChangeNumberOfGroups = (newValue) => {
    const parsed = parseInt(newValue, 10);
    if (parsed > 0 && parsed <= students.length)
      setNumberOfGroupsToCreate(parsed);
  };

  useEffect(() => {
    const list = groupOption === 'Aléatoire' ? _.shuffle(students) : students;
    const groups = makeGroups(list, numberOfGroupsToCreate);
    setGroupList(
      groups.map((members, index) => ({ name: `GR${index + 1}`, members }))
    );
  }, [numberOfGroupsToCreate, students, groupOption]);

  const validNumberOfGroups = new Array(students.length)
    .fill()
    .map((el, i) => i + 1)
    .map((n) => (
      <MenuItem key={n} value={n}>
        {n}
      </MenuItem>
    ));

  return (
    <>
      <h2 className="text-center text-3xl">Create groups</h2>
      {studentsLoading ? (
        <CircularProgress />
      ) : (
        <div className="text-center">
          <p className="text-xl">
            with <em>{students.length}</em> students
          </p>
          <form className="p-5 m-3.5 mb-5">
            <IconButton
              onClick={() =>
                safelyChangeNumberOfGroups(numberOfGroupsToCreate - 1)
              }
              aria-label="decrement number of groups"
            >
              <RemoveIcon />
            </IconButton>
            <FormControl style={{ minWidth: 140 }}>
              <InputLabel
                style={{ position: 'relative', left: '17px' }}
                id="numberOfGroups"
              >
                Number of groups
              </InputLabel>
              <Select
                labelId="numberOfGroups"
                id="numberOfGroups"
                value={validNumberOfGroups.length ? numberOfGroupsToCreate : ''}
                onChange={(e) => safelyChangeNumberOfGroups(e.target.value)}
              >
                {validNumberOfGroups}
              </Select>
            </FormControl>
            <IconButton
              onClick={() =>
                safelyChangeNumberOfGroups(numberOfGroupsToCreate + 1)
              }
              aria-label="incrment number of groups"
            >
              <AddIcon />
            </IconButton>
            <div>
              <input
                type="radio"
                value="Aléatoire"
                name="groupcreationoption"
                checked={groupOption === 'Aléatoire'}
                onChange={changeGroupOption}
              />{' '}
              Aléatoire
              <input
                type="radio"
                value="Ordonné"
                name="groupcreationoption"
                checked={groupOption === 'Ordonné'}
                onChange={changeGroupOption}
              />
              Ordonné
            </div>
          </form>
          <GroupList groups={groupList} />
        </div>
      )}
    </>
  );
}
