import { v4 as uuid } from 'uuid';
import useSound from 'use-sound';
import { Button, TextField, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useTransition, animated } from 'react-spring';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import StopIcon from '@material-ui/icons/Stop';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Avatar from '../components/Avatar';
import API from '../APIClient';
import NumberInput from '../components/NumberInput';
import ticksNDong from '../sounds/ticksndong.mp3';

const synth = window.speechSynthesis;

function speak(text) {
  if (!synth || synth.speaking) {
    return;
  }
  if (text !== '') {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synth.getVoices().find((v) => v.lang === 'en-GB');
    synth.speak(utterance);
  }
}

dayjs.extend(duration);

const useStyles = makeStyles({
  noOptions: {
    display: 'none',
  },
});

export default function DojoPage() {
  const [
    playTicksAndDong,
    { stop: stopTicksAndDong, pause: pauseTicksAndDong },
  ] = useSound(ticksNDong, {
    volume: 0.2,
    interrupt: false,
  });
  const [editingChrono, setEditingChrono] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [team, setTeam] = useState([]);
  const [chronoInitialSeconds, setChronoInitialSeconds] = useState(0);
  const [chronoInitialMinutes, setChronoInitialMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(
    chronoInitialSeconds + 60 * chronoInitialMinutes
  );
  const [chronoStarted, setChronoStarted] = useState(false);
  const [usersToAddToTeam, setUsersToAddToTeam] = useState([]);
  const [autocompleteInputText, setAutocompleteInputText] = useState('');
  const classes = useStyles();

  const handleTeamMemberRemoval = (id) =>
    setTeam((currentTeam) => currentTeam.filter((member) => member.id !== id));

  const handleTeamRotation = () => {
    if (team.length) setTeam(([first, ...others]) => [...others, first]);
  };

  const handleChronoToggle = () => {
    if (chronoStarted) {
      pauseTicksAndDong();
      if (synth.speaking) synth.cancel();
    }
    setChronoStarted(!chronoStarted);
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

  useEffect(() => {
    let timerId = null;

    if (chronoStarted) {
      timerId = setInterval(() => {
        setSecondsLeft((left) => left - 1);
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [chronoStarted]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setSecondsLeft(chronoInitialMinutes * 60 + chronoInitialSeconds);
      handleTeamRotation();
    }
    if (secondsLeft === 4) {
      playTicksAndDong();
    }
  }, [secondsLeft]);

  const [pilot, copilot] = team;

  useEffect(() => {
    if (team.length >= 2 && chronoStarted)
      speak(`${pilot.firstName} pilot. ${copilot.firstName} co-pilot.`);
  }, [pilot, copilot]);

  const handleNewStudentAddition = (e) => {
    e.preventDefault();
    if (autocompleteInputText) {
      setTeam([...team, { firstName: autocompleteInputText, id: uuid() }]);
      setAutocompleteInputText('');
    }
  };

  const rowHeight = 50;
  const transitions = useTransition(
    team.map((data, i) => ({ ...data, y: rowHeight * i })),
    {
      key: (item) => item.id,
      from: { opacity: 0, width: '0%', height: 0 },
      leave: { opacity: 0, height: 0 },
      enter: ({ y }) => ({
        y,
        width: '100%',
        opacity: 1,
        height: rowHeight,
      }),
      update: ({ y, height }) => ({ y, height }),
    }
  );

  const handleAddMembers = () => {
    setTeam((currentTeam) => [...currentTeam, ...usersToAddToTeam]);
    setUsersToAddToTeam([]);
  };

  const selectableNewMembers = students.filter(
    (s) => !team.map((m) => m.id).includes(s.id)
  );

  return (
    <>
      <div className="flex justify-between mt-5">
        <Button
          onClick={handleChronoToggle}
          variant="contained"
          color={chronoStarted ? 'secondary' : 'primary'}
          startIcon={
            chronoStarted ? <StopIcon /> : <PlayCircleFilledWhiteIcon />
          }
        >
          {chronoStarted ? 'Stop' : 'Start'}
        </Button>
        <Button
          onClick={handleTeamRotation}
          variant="contained"
          color="primary"
          disabled={chronoStarted}
          startIcon={<RotateRightIcon />}
        >
          Rotate Team
        </Button>
      </div>
      <div className="text-3xl m-5 text-center ">
        {editingChrono ? (
          <div className="flex flex-col">
            <NumberInput
              min={0}
              label="minutes"
              value={chronoInitialMinutes}
              onChange={(val) => setChronoInitialMinutes(val)}
            />

            <NumberInput
              label="seconds"
              step={10}
              min={0}
              max={60}
              value={chronoInitialSeconds}
              onChange={(val) => setChronoInitialSeconds(val)}
            />
            <div className="mt-5">
              <Button
                onClick={() => {
                  let sec = chronoInitialSeconds + chronoInitialMinutes * 60;
                  if (sec < 5) sec = 5;
                  setSecondsLeft(sec);
                  setEditingChrono(false);
                  setChronoStarted(true);
                  stopTicksAndDong();
                }}
                variant="contained"
                color="primary"
              >
                Restart with that
              </Button>
            </div>

            <div className="mt-2">
              <Button
                onClick={() => {
                  setEditingChrono(false);
                }}
                variant="contained"
                color="primary"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setEditingChrono(true)}
            className="cursor-pointer"
          >
            {dayjs.duration(secondsLeft, 'seconds').format('mm:ss')}
          </div>
        )}
      </div>

      <div
        style={{
          height: rowHeight * team.length,
          transition: 'height 0.5s ease-out',
        }}
        className="relative rounded-md overflow-hidden"
      >
        {transitions(({ y, ...rest }, item, t, index) => {
          let bgColor = 'bg-blue-100';
          if (index === 0) bgColor = 'bg-yellow-500';
          if (index === 1) bgColor = 'bg-yellow-300';

          return (
            <animated.div
              key={item.key}
              style={{
                transform: y.to((v) => `translate3d(0,${v}px,0)`),
                height: rowHeight,
                position: 'absolute',
                willChange: 'transform, height, opacity, background-color',
                transition: 'background-color 1s ease-out',
                width: '100%',
                ...rest,
              }}
              className={`${bgColor} p-3 overflow-hidden shadow-lg ${
                index === team.length - 1 ? '' : 'border-b border-gray-500'
              }`}
            >
              <div className="flex h-full items-center justify-between">
                <div className="flex">
                  <Avatar avatarUrl={item.avatarUrl} size={30} />
                  <p className="ml-3">{item.firstName}</p>
                </div>

                <IconButton onClick={() => handleTeamMemberRemoval(item.id)}>
                  <RemoveCircleIcon color="action" />
                </IconButton>
              </div>
            </animated.div>
          );
        })}
      </div>

      <form
        autoComplete="off"
        onSubmit={handleNewStudentAddition}
        className="mt-5 flex justify-between h-13"
      >
        <Autocomplete
          value={usersToAddToTeam}
          disabled={chronoStarted}
          id="user-select"
          fullWidth
          options={studentsLoading ? [] : selectableNewMembers}
          autoHighlight
          getOptionLabel={(option) => option.firstName}
          multiple
          classes={{
            noOptions: classes.noOptions,
          }}
          renderOption={(option) => (
            <div className="flex items-center">
              <Avatar size={30} avatarUrl={option.avatarUrl} />
              <p className="ml-3">{option.firstName}</p>
            </div>
          )}
          disableCloseOnSelect
          renderInput={(params) => (
            <TextField
              fullWidth
              {...params}
              onChange={(e) => {
                setAutocompleteInputText(e.target.value);
              }}
              label="Add team members"
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                value: autocompleteInputText,
                autoComplete: 'off',
              }}
            />
          )}
          onChange={(e, selectedUsers) => setUsersToAddToTeam(selectedUsers)}
        />
        <div className="ml-3">
          <Button
            className="h-full"
            onClick={handleAddMembers}
            variant="contained"
            color="primary"
            disabled={chronoStarted}
            startIcon={<AddIcon />}
          />
        </div>
      </form>
    </>
  );
}
