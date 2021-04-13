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
  const [numberOfGroupsToCreate, setNumberOfGroupsToCreate] = useState(1);

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

  const handleNumberOfGroupsToCreateChange = (e) => {
    setNumberOfGroupsToCreate(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    const groups = makeGroups(
      _.shuffle(students),
      numberOfGroupsToCreate
    ).map((group, index) => ({ name: `GR${index + 1}`, members: group }));
    setGroupList(groups);
  }, [numberOfGroupsToCreate, students]);

  return (
    <>
      <h2 className="text-center text-3xl">Create groups</h2>
      {studentsLoading ? (
        'Loading stduents to make groups...'
      ) : (
        <>
          with <em>{students.length}</em> students
          <br />
          <label htmlFor="numberOfGroups">
            Number of groups : {'  '}
            <input
              type="number"
              id="numberOfGroups"
              name="numberOfGroups"
              min="1"
              value={numberOfGroupsToCreate}
              onChange={handleNumberOfGroupsToCreateChange}
            />
          </label>
          <h2 className="text-center text-2xl mb-5"> Groups </h2>
          <GroupList groups={groupList} />
        </>
      )}
    </>
  );
}
