/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import API from '../APIClient';

export default function GetResetPasswordMailPage() {
  const [emailSent, setEmailSent] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data) => {
    API.post('/users/reset-password-email', data).then(() => {
      setEmailSent(true);
    });
  };

  return (
    <>
      <h2 className="text-3xl text-center mb-5">
        Get password reset instructions
      </h2>{' '}
      {emailSent ? (
        <p>
          An email has been sent to the given address with instructions to reset
          your password, please check your mailbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="pb-12">
          <div className="my-5">
            <Controller
              name="email"
              control={control}
              rules={{
                required: { value: true, message: 'Required' },
                pattern: { value: /^\S+@\S+$/i, message: 'invalid email' },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  {...field}
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ''}
                  label="Email"
                />
              )}
            />
          </div>

          <div className="my-8">
            <Button variant="contained" color="primary" type="submit" fullWidth>
              OK
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
