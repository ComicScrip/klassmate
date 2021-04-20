/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Input from '@material-ui/core/Input';
import Avatar from '../components/Avatar';

export default function ProfilePage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [discordId, setDiscordId] = useState('');
  const [meetUrl, setMeetUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://avatars.githubusercontent.com/u/63284636?v=4'
  );

  const { control, handleSubmit } = useForm();
  const onSubmit = (data) => window.console.log(data);

  return (
    <>
      <h2>Profile page</h2>
      <Avatar avatarUrl={avatarUrl} size={100} alt={`${firstName} avatar`} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="firstName"
          control={control}
          defaultValue=""
          render={({ field }) => <input {...field} />}
        />
        <Controller
          name="lastName"
          control={control}
          defaultValue={lastName}
          render={({ field }) => <input {...field} />}
        />
        <Controller
          name="avatarUrl"
          control={control}
          defaultValue={avatarUrl}
          render={({ field }) => <input {...field} />}
        />
        <Controller
          name="meetUrl"
          control={control}
          defaultValue={meetUrl}
          render={({ field }) => <input {...field} />}
        />
        <Controller
          name="discordId"
          control={control}
          defaultValue={discordId}
          render={({ field }) => <input {...field} />}
        />
        <Input type="submit" value="Save" />
      </form>
    </>
  );
}
