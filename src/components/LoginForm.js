import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import qs from 'query-string';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useToasts } from 'react-toast-notifications';
import API from '../APIClient';

export default function LoginForm() {
  const { addToast } = useToasts();

  const history = useHistory();
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

  const onSubmit = ({ email, password, stayConnected }) => {
    setLoginError(null);
    API.post('/auth/login', { email, password, stayConnected })
      .then(() => {
        const { redirectUrl } = qs.parse(window.location.search);
        if (redirectUrl) history.push(redirectUrl);
        addToast('Logged in successfully', { appearance: 'success' });
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          addToast('Wrong email or password', { appearance: 'error' });
        } else window.console.error(err);
      });
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
