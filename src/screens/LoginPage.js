import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@material-ui/core';
import React, { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CurrentUserContext } from '../contexts/currentUser';

export default function LoginPage() {
  const { login, isLoggedIn, profile, logout } = useContext(CurrentUserContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      stayConnected: false,
    },
  });

  if (isLoggedIn)
    return (
      <div className="mt-36 text-center">
        <p className="mb-2">
          You are logged in as <em>{profile.email}</em>.
        </p>
        <p className="mb-10">Want to switch user ?</p>
        <Button
          onClick={logout}
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
        >
          Log Out
        </Button>
      </div>
    );

  return (
    <form onSubmit={handleSubmit(login)}>
      <h2 className="text-3xl text-center mb-5">Login</h2>{' '}
      <Controller
        name="email"
        control={control}
        rules={{
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Does not look like an email address',
          },
          required: { value: true, message: 'Required' },
        }}
        render={({ field }) => (
          <TextField
            inputProps={field}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
            label="Email"
            variant="outlined"
            className="w-full"
          />
        )}
      />
      <br />
      <br />
      <Controller
        name="password"
        control={control}
        rules={{
          minLength: { value: 8, message: 'should be at least 8 characters' },
        }}
        render={({ field }) => (
          <TextField
            type="password"
            inputProps={field}
            error={!!errors.email}
            helperText={errors.password ? errors.password.message : ''}
            label="Password"
            variant="outlined"
            className="w-full"
          />
        )}
      />
      <div className="flex justify-end mt-5 mb-5">
        <Controller
          name="stayConnected"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} name="checkedB" color="primary" />}
              label="Stay connected"
            />
          )}
        />
      </div>
      <Button fullWidth variant="contained" color="primary" type="submit">
        Log In
      </Button>
    </form>
  );
}
