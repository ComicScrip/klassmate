import { Button, CircularProgress, Slider } from '@material-ui/core';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import DoneIcon from '@material-ui/icons/Done';
import Alert from '@material-ui/lab/Alert';
import dayjs from 'dayjs';
import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import API from '../APIClient';
import AvatarWithInfo from '../components/AvatarWithInfo';
import { CurrentUserContext } from '../contexts/currentUser';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const energyLevelToLabel = (lvl) => {
  if (lvl > 0 && lvl <= 25) {
    return 'I need a break now';
  }
  if (lvl > 25 && lvl <= 50) {
    return "Soon I'll need a break";
  }
  if (lvl > 50 && lvl <= 75) {
    return "I'm OK";
  }
  if (lvl > 75 && lvl <= 100) {
    return 'Top';
  }
  return '';
};

const statusToAvatarColor = {
  done: 'green',
  stuck: 'orange',
};

export default function ShowActivityPage() {
  const { id } = useParams();
  const [completionStatus, setCompletionStatus] = useState('inProgress');
  const [energyLevel, setEnergyLevel] = useState(80);
  const [loadingActivity, setloadingActivity] = useState('');
  const [error, setError] = useState('');
  const [activity, setActivity] = useState(null);
  const [activityAttendees, setActivityAttendees] = useState([]);
  const socketRef = useRef();
  const { profile } = useContext(CurrentUserContext);

  const [nextMeetingTimeMessage, setNextMeetingTimeMessage] = useState('');

  useEffect(() => {
    const updateClock = () => {
      if (
        activity &&
        activity.nextGroupMeetingTime &&
        dayjs().isBefore(dayjs(activity.nextGroupMeetingTime))
      ) {
        setNextMeetingTimeMessage(
          dayjs(activity.nextGroupMeetingTime).fromNow()
        );
      }
    };
    updateClock();
    const intervalId = setInterval(updateClock, 10000);

    return () => {
      clearInterval(intervalId);
    };
  });

  const udpateAttendee = (userId, data) => {
    setActivityAttendees((users) =>
      users.map((user) => {
        if (user.id.toString() === userId.toString())
          return { ...user, ...data };
        return user;
      })
    );
  };

  useEffect(() => {
    socketRef.current = socketIOClient(process.env.REACT_APP_API_BASE_URL, {
      withCredentials: true,
    });
    socketRef.current.emit('joinActivity', id);
    socketRef.current.on('activityAttendees', (users) => {
      setActivityAttendees(users);
      const me = users.find(
        (u) => profile && u.id.toString() === profile.id.toString()
      );
      setCompletionStatus(me.completionStatus);
      if (me.energyLevel !== null) {
        setEnergyLevel(me.energyLevel);
      }
    });
    socketRef.current.on('userJoined', (user) =>
      setActivityAttendees((users) => [
        ...users.filter((u) => u.id.toString() !== user.id.toString()),
        user,
      ])
    );
    socketRef.current.on('userLeft', (userId) =>
      setActivityAttendees((users) =>
        users.filter((user) => user.id.toString() !== userId.toString())
      )
    );

    socketRef.current.on(
      'activityParticipationUpdatedFromServer',
      ({ userId, completionStatus: s, energyLevel: e }) => {
        udpateAttendee(userId, { completionStatus: s, energyLevel: e });
      }
    );

    socketRef.current.on('activityUpdated', setActivity);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const changeCurrentUserStatus = (input) => {
    const status = input === completionStatus ? 'inProgress' : input;
    setCompletionStatus(status);
    socketRef.current.emit('activityParticipationUpdatedFromClient', {
      completionStatus: status,
    });
    udpateAttendee(profile.id, {
      completionStatus: status,
    });
  };

  const handleEnergyLevelChange = (lvl) => {
    socketRef.current.emit('activityParticipationUpdatedFromClient', {
      energyLevel: lvl,
    });
    udpateAttendee(profile.id, {
      energyLevel: lvl,
    });
    setEnergyLevel(lvl);
  };

  useEffect(() => {
    setloadingActivity(true);
    API.get(`/activities/${id}`)
      .then((res) => {
        setActivity(res.data);
      })
      .catch(() => setError('Cannot show this activity, sorry'))
      .finally(() => {
        setloadingActivity(false);
      });
  }, []);

  if (loadingActivity) {
    return (
      <div className="flex justify-center items-center h-5/6">
        <CircularProgress />
      </div>
    );
  }
  if (error) return <Alert severity="error">{error}</Alert>;

  if (!activity) return null;

  const { name } = activity;

  const avgEnergyLevel =
    activityAttendees.reduce((sum, user) => {
      return sum + (user.energyLevel ? parseInt(user.energyLevel, 10) : 0);
    }, 0) / activityAttendees.length;

  return (
    <div>
      <h2 className="text-center text-3xl mb-5">{name}</h2>
      {nextMeetingTimeMessage && (
        <p className="text-right text-sm mb-5">
          Group meeting <em>{nextMeetingTimeMessage}</em>
        </p>
      )}
      <div>
        <div className="flex flex-wrap">
          {activityAttendees
            .sort((u1, u2) => u1.id < u2.id)
            .map((u) => (
              <div key={u.id} className="flex flex-col align-center m-2">
                <AvatarWithInfo
                  avatarUrl={u.avatarUrl}
                  size={50}
                  borderColor={statusToAvatarColor[u.completionStatus] || null}
                  meetUrl={u.meetUrl}
                  discordId={u.discordId}
                  firstName={u.firstName}
                />
              </div>
            ))}
        </div>

        <div className="flex mt-10 justify-between">
          <Button
            variant={completionStatus === 'done' ? 'contained' : 'outlined'}
            color="primary"
            startIcon={<DoneIcon />}
            onClick={() => changeCurrentUserStatus('done')}
          >
            I'm done !
          </Button>
          <Button
            variant={completionStatus === 'stuck' ? 'contained' : 'outlined'}
            color="secondary"
            startIcon={<ContactSupportIcon />}
            onClick={() => changeCurrentUserStatus('stuck')}
          >
            I'm stuck
          </Button>
        </div>
      </div>
      <div className="mt-8">
        <p>Energy Level : {energyLevelToLabel(energyLevel)}</p>

        <Slider
          value={energyLevel}
          aria-labelledby="discrete-slider-restrict"
          step={1}
          valueLabelDisplay="auto"
          min={0}
          max={100}
          onChange={(e, value) => setEnergyLevel(value)}
          onChangeCommitted={(e, value) => {
            handleEnergyLevelChange(value);
          }}
          marks={
            activityAttendees.length > 1
              ? [
                  {
                    value: avgEnergyLevel,
                    label: 'avg',
                  },
                ]
              : []
          }
        />
      </div>
    </div>
  );
}
