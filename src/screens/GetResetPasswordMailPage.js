/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Controller, useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import API from '../APIClient';
// eslint-disable-next-line

export default function GetResetPasswordMailPage() {
  const { addToast } = useToasts();
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
      addToast(
        'An email has been sent with instructions to reset your password, please check your mailbox.',
        { appearance: 'success' }
      );
    });
  };

  return (
    <>
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
                label="email"
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
