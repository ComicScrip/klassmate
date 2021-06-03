/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import API from '../APIClient';
import Avatar from '../components/Avatar';

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const { control, handleSubmit, watch, setValue } = useForm({
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

  useEffect(() => {
    API.get('/currentUser')
      .then((res) => res.data)
      .then((profile) => {
        setValue('firstName', profile.firstName);
        setValue('lastName', profile.lastName);
      })
      .catch((err) => {
        window.console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Avatar avatarUrl={avatarUrl} size={100} alt={`${firstName} avatar`} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                {...field}
                disabled={isLoading}
                label="First name"
              />
            )}
          />
        </div>
        <div className="my-5">
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                {...field}
                disabled={isLoading}
                label="Last name"
              />
            )}
          />
        </div>
        <div className="my-5">
          <Controller
            name="avatarUrl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                disabled={isLoading}
                label="Avatar URL"
              />
            )}
          />
        </div>

        <div className="my-5">
          <Controller
            name="meetUrl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                disabled={isLoading}
                label="Meet URL"
              />
            )}
          />
        </div>

        <div className="my-5">
          <Controller
            name="discordId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Discord Id"
                disabled={isLoading}
              />
            )}
          />
        </div>

        <Button
          disabled={isLoading}
          variant="contained"
          color="primary"
          type="submit"
        >
          Save
        </Button>
      </form>
    </>
  );
}
