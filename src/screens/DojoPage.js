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
  const initialTimerValue = 300;
  const [team, setTeam] = useState(initialTeam);
  const [pilot, copilot, ...otherMembers] = team;
  const [secondsLeft, setSecondsLeft] = useState(initialTimerValue);
  const [chronoStarted, setChronoStarted] = useState(false);

  const handleTeamRotation = () => {
    setTeam(([first, ...others]) => [...others, first]);
  };

  const handleChronoToggle = () => {
    setChronoStarted(!chronoStarted);
  };

  useEffect(() => {
    const timerId = chronoStarted
      ? setInterval(() => {
          setSecondsLeft((left) => {
            if (!left) {
              handleTeamRotation();
              return initialTimerValue;
            }
            return left - 1;
          });
        }, 1000)
      : null;
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [chronoStarted]);

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
    </>
  );
}
