/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Controller, useForm } from 'react-hook-form';
import Avatar from '../components/Avatar';

export default function ProfilePage() {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      avatarUrl: '',
      discordId: '',
      meetUrl: '',
    },
  });
  const onSubmit = (data) => window.console.log(data);
  const firstName = watch('firstName');
  const avatarUrl = watch('avatarUrl');

  return (
    <>
      <Avatar avatarUrl={avatarUrl} size={100} alt={`${firstName} avatar`} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => <TextField {...field} label="First name" />}
          />
        </div>
        <div className="my-5">
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => <TextField {...field} label="Last name" />}
          />
        </div>
        <div className="my-5">
          <Controller
            name="avatarUrl"
            control={control}
            render={({ field }) => <TextField {...field} label="Avatar URL" />}
          />
        </div>

        <div className="my-5">
          <Controller
            name="meetUrl"
            control={control}
            render={({ field }) => <TextField {...field} label="Meet URL" />}
          />
        </div>

        <div className="my-5">
          <Controller
            name="discordId"
            control={control}
            render={({ field }) => <TextField {...field} label="Discord Id" />}
          />
        </div>

        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
      </form>
    </>
  );
}
