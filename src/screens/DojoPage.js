import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';

dayjs.extend(duration);

const initialTeam = [
  {
    firstName: 'Jeanne',
  },
  {
    firstName: 'Pierre',
  },
  {
    firstName: 'Paulette',
  },
  {
    firstName: 'Jacques',
  },
];

export default function DojoPage() {
  const initialTimerValue = 15;
  const [team, setTeam] = useState(initialTeam);
  const [pilot, copilot, ...otherMembers] = team;
  const [secondsLeft, setSecondsLeft] = useState(initialTimerValue);
  const [chronoStarted, setChronoStarted] = useState(false);

  const [newStudentName, setNewStudentName] = useState('');

  const handleNewStudentNameChange = (e) => {
    setNewStudentName(e.target.value);
  };

  const handleTeamRotation = () => {
    // setTeam(([first, ...others]) => [...others, first]);
    setTeam(([first, ...others]) => [...others, first]);
  };

  const handleChronoToggle = () => {
    setChronoStarted(!chronoStarted);
  };

  useEffect(() => {
    let timerId = null;

    if (chronoStarted) {
      timerId = setInterval(() => {
        setSecondsLeft((left) => left - 1);
      }, 1000);
    }

    window.console.log('in useEffect, timer id :', timerId);

    return () => {
      window.console.log('cleaning timer id : ', timerId);
      if (timerId) clearInterval(timerId);
    };
  }, [chronoStarted]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setSecondsLeft(initialTimerValue);
      handleTeamRotation();
    }
  }, [secondsLeft]);

  const handleNewStudentAddition = (e) => {
    e.preventDefault();
    setTeam([...team, { firstName: newStudentName }]);
    setNewStudentName('');
  };

  return (
    <>
      <button type="button" onClick={handleChronoToggle}>
        {chronoStarted ? 'Stop' : 'Start'}
      </button>
      <button type="button" onClick={handleTeamRotation}>
        Team Rotation
      </button>
      <div className="text-xl">
        {dayjs.duration(secondsLeft, 'seconds').format('mm:ss')}
      </div>
      <div className="bg-yellow-600">{pilot.firstName}</div>
      <div className="bg-yellow-300">{copilot.firstName}</div>
      {otherMembers.map((member) => (
        <div key={member.firstName} className="bg-blue-100">
          {member.firstName}
        </div>
      ))}
      <form onSubmit={handleNewStudentAddition}>
        <input
          type="text"
          placeholder="Add new student"
          value={newStudentName}
          onChange={handleNewStudentNameChange}
        />
        <button type="submit">Add</button>
      </form>
    </>
  );
}
