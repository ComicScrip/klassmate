/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import qs from 'query-string';
import { Controller, useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import API from '../APIClient';
// eslint-disable-next-line

export default function ResetPasswordPage() {
  const { addToast } = useToasts();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (data) => {
    const { userId, token } = qs.parse(window.location.search);
    API.post('/users/reset-password', {
      password: data.password,
      token,
      userId,
    })
      .then(() => {
        addToast('Your password has been updated', { appearance: 'success' });
      })
      .catch((err) => {
        addToast(
          'Your password could not be updated, try to ask for a new password email',
          { appearance: 'error' }
        );
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="pb-12">
        <div className="my-5">
          <Controller
            name="password"
            control={control}
            rules={{
              required: { value: true, message: 'Required' },
            }}
            render={({ field }) => (
              <TextField
                type="password"
                fullWidth
                {...field}
                error={!!errors.password}
                helperText={errors.email ? errors.password.message : ''}
                label="New password"
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
