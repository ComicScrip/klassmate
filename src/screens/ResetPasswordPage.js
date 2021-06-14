/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import qs from 'query-string';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useToasts } from 'react-toast-notifications';
import API from '../APIClient';
// eslint-disable-next-line

export default function ResetPasswordPage() {
  const history = useHistory();
  const { addToast } = useToasts();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  });
  const password = watch('password');

  const onSubmit = (data) => {
    const { userId, token } = qs.parse(window.location.search);
    API.post('/users/reset-password', {
      password: data.password,
      token,
      userId,
    })
      .then(() => {
        addToast(
          'Your password has been updated, you can now log in with the latter',
          { appearance: 'success' }
        );
        history.push('/');
      })
      .catch((err) => {
        addToast(
          'Your password could not be updated, try to get new password reset instructions by email',
          { appearance: 'error' }
        );
        history.push('/password-reset-instructions');
      });
  };

  return (
    <>
      <h2 className="text-3xl text-center mb-5">Reset your password</h2>{' '}
      <form onSubmit={handleSubmit(onSubmit)} className="pb-12">
        <div className="my-5">
          <Controller
            name="password"
            control={control}
            rules={{
              required: { value: true, message: 'Required' },
              minLength: {
                value: 8,
                message: 'Must have at least 8 characters',
              },
            }}
            render={({ field }) => (
              <TextField
                type="password"
                fullWidth
                {...field}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
                label="New password"
              />
            )}
          />
        </div>
        <div className="my-5">
          <Controller
            name="passwordConfirmation"
            control={control}
            rules={{
              required: { value: true, message: 'Required' },
              minLength: {
                value: 8,
                message: 'Must have at least 8 characters',
              },
              validate: (value) =>
                value === password || 'The passwords do not match',
            }}
            render={({ field }) => (
              <TextField
                type="password"
                fullWidth
                {...field}
                error={!!errors.passwordConfirmation}
                helperText={
                  errors.passwordConfirmation
                    ? errors.passwordConfirmation.message
                    : ''
                }
                label="New password confirmation"
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
    </>
  );
}
