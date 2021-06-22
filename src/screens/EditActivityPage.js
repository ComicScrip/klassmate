import DateFnsUtils from '@date-io/date-fns';
import { Button, CircularProgress, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import API from '../APIClient';

const { CancelToken } = axios;

export default function EditActivityPage() {
  const { id } = useParams();
  const isUpdate = id !== 'new';
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const { addToast } = useToasts();

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      nextGroupMeetingTime: new Date(),
    },
  });

  useEffect(() => {
    let source = null;

    if (isUpdate) {
      setLoadingExisting(true);
      source = CancelToken.source();
      API.get(`/activities/${id}`, { cancelToken: source.token })
        .then((res) => {
          const { name, nextGroupMeetingTime } = res.data;
          setValue('name', name);
          setValue('nextGroupMeetingTime', nextGroupMeetingTime);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) setError('Cannot get this activity');
        })
        .finally(() => {
          if (
            !(
              source.token.reason &&
              source.token.reason.message === 'request cancelled'
            )
          )
            setLoadingExisting(false);
        });
    }

    return () => {
      if (source) {
        source.cancel('request cancelled');
      }
    };
  }, []);

  const history = useHistory();
  const onSubmit = (data) => {
    setError('');
    setSubmitting(true);
    const setSubmittingFalse = () => setSubmitting(false);

    if (isUpdate) {
      const time = dayjs(data.nextGroupMeetingTime);
      const nextGroupMeetingTime = dayjs()
        .set('hours', time.hour())
        .set('minutes', time.hour())
        .format();
      const toSend = { ...data, nextGroupMeetingTime };
      API.patch(`/activities/${id}`, toSend)
        .then((res) => {
          addToast('Successfully updated', { appearance: 'success' });
          history.push(`/activities/${res.data.id}`);
        })
        .catch(() => {
          setError('Cannot update this activity.');
        })
        .finally(setSubmittingFalse);
    } else {
      API.post('/activities', data)
        .then((res) => {
          addToast('Successfully created', { appearance: 'success' });
          history.push(`/activities/${res.data.id}`);
        })
        .catch(() => {
          setError('Cannot create this activity.');
        })
        .finally(setSubmittingFalse);
    }
  };

  return (
    <div>
      <h2 className="text-3xl text-center mb-5">
        {isUpdate ? 'Edit a activity' : 'Create a new activity'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Controller
            name="name"
            control={control}
            rules={{
              required: { value: true, message: 'required' },
            }}
            render={({ field }) => {
              return (
                <TextField
                  inputProps={field}
                  disabled={loadingExisting || submitting}
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ''}
                  label="Name"
                  variant="outlined"
                  className="w-full"
                />
              );
            }}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Controller
              name="nextGroupMeetingTime"
              control={control}
              rules={{
                required: { value: true, message: 'required' },
              }}
              render={({ field }) => {
                return (
                  <KeyboardTimePicker
                    value={field.value}
                    onChange={field.onChange}
                    margin="normal"
                    id="nextGroupMeetingTime"
                    label="Next group meeting time"
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                );
              }}
            />
          </MuiPickersUtilsProvider>
        </div>

        {error && (
          <div className="mt-5">
            <Alert severity="error">{error}</Alert>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          {(submitting || loadingExisting) && (
            <CircularProgress className="mr-5" />
          )}
          <Button
            disabled={submitting || loadingExisting}
            variant="contained"
            color="primary"
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
