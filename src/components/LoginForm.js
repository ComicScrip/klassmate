import { Button, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function LoginForm() {
  const [loginError, setLoginError] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = ({ email, password }) => {
    window.console.log({ email, password });
    setLoginError(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loginError && (
        <div className="mb-5">
          <Alert severity="error">{loginError}</Alert>
        </div>
      )}
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
      <br />
      <br />
      <Button fullWidth variant="contained" color="primary" type="submit">
        Log In
      </Button>
    </form>
  );
}
