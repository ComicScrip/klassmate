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
    const groups = makeGroups(_.shuffle(students), numberOfGroupsToCreate);
    setGroupList(
      groups.map((members, index) => ({ name: `GR${index + 1}`, members }))
    );
  }, [numberOfGroupsToCreate, students]);

  return (
    <>
      <h2 className="text-center text-3xl">Create groups</h2>
      {studentsLoading ? (
        <CircularProgress />
      ) : (
        <div className="text-center">
          <p className="text-center text-xl">
            with <em>{students.length}</em> students
          </p>
          <form className="p-5 m-3.5 ">
            <IconButton
              onClick={() =>
                safelyChangeNumberOfGroups(numberOfGroupsToCreate - 1)
              }
              aria-label="decrement number of groups"
            >
              <RemoveIcon />
            </IconButton>
            <FormControl style={{ minWidth: 140 }}>
              <InputLabel labelPlacement="end" id="numberOfGroups">
                Number of groups
              </InputLabel>
              <Select
                labelId="numberOfGroups"
                id="numberOfGroups"
                value={numberOfGroupsToCreate}
                onChange={(e) => safelyChangeNumberOfGroups(e.target.value)}
              >
                {new Array(students.length).fill().map((el, i) => (
                  <MenuItem value={i + 1}>{i + 1}</MenuItem>
                ))}
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
          </form>
          <GroupList groups={groupList} />
        </div>
      )}
    </>
  );
}
