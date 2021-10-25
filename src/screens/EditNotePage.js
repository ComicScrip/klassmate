import MDEditor from '@uiw/react-md-editor';
import { Button, CircularProgress, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import API from '../APIClient';

const { CancelToken } = axios;

export default function EditNotePage() {
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
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    let source = null;

    if (isUpdate) {
      setLoadingExisting(true);
      source = CancelToken.source();
      API.get(`/notes/${id}`, { cancelToken: source.token })
        .then((res) => {
          const { title, content } = res.data;
          setValue('title', title);
          setValue('content', content);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) setError('Cannot get this note');
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
      API.patch(`/notes/${id}`, data)
        .then((res) => {
          addToast('Successfully updated', { appearance: 'success' });
          history.push(`/notes/${res.data.id}`);
        })
        .catch(() => {
          setError('Cannot update this note.');
        })
        .finally(setSubmittingFalse);
    } else {
      API.post('/notes', data)
        .then((res) => {
          addToast('Successfully created', { appearance: 'success' });
          history.push(`/notes/${res.data.id}`);
        })
        .catch(() => {
          setError('Cannot create this note.');
        })
        .finally(setSubmittingFalse);
    }
  };

  return (
    <div>
      <h2 className="text-3xl text-center mb-5">
        {isUpdate ? 'Edit a note' : 'Create a new note'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Controller
            name="title"
            control={control}
            rules={{
              required: { value: true, message: 'required' },
            }}
            render={({ field }) => {
              return (
                <TextField
                  inputProps={field}
                  disabled={loadingExisting || submitting}
                  error={!!errors.title}
                  helperText={errors.title ? errors.title.message : ''}
                  label="Title"
                  variant="outlined"
                  className="w-full"
                />
              );
            }}
          />
        </div>
        <div>
          <Controller
            name="content"
            control={control}
            rules={{
              required: { value: true, message: 'required' },
            }}
            render={({ field }) => {
              // return (
              //   <TextField
              //     inputProps={field}
              //     label="Content"
              //     disabled={loadingExisting || submitting}
              //     error={!!errors.content}
              //     helperText={errors.content ? errors.content.message : ''}
              //     multiline
              //     rows={15}
              //     variant="outlined"
              //     className="w-full"
              //   />
              // );

              return (
                <div
                  style={{
                    padding: errors.content ? 3 : 0,
                    borderWidth: errors.content ? 1 : 0,
                    borderColor: 'red',
                  }}
                >
                  <MDEditor value={field.value} onChange={field.onChange} />
                  {errors.content && (
                    <p style={{ color: 'red' }}>
                      {errors.content ? errors.content.message : ''}
                    </p>
                  )}
                </div>
              );
            }}
          />
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
