/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useContext, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Avatar from '../components/Avatar';
import { CurrentUserContext } from '../contexts/currentUser';

const urlRegex = /https?:\/\/|blob:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

export default function ProfilePage() {
  const {
    profile,
    getProfile,
    updateProfile,
    loadingProfile,
    savingProfile,
  } = useContext(CurrentUserContext);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      avatarUrl: '',
      discordId: '',
      meetUrl: '',
    },
  });
  const avatarUploadRef = useRef();

  useEffect(() => getProfile(), []);

  useEffect(() => {
    if (profile) {
      const { firstName, lastName, avatarUrl, meetUrl, discordId } = profile;
      const valuesToUpdate = {
        firstName,
        lastName,
        avatarUrl: avatarUrl || '',
        meetUrl: meetUrl || '',
        discordId: discordId || '',
      };

      reset(valuesToUpdate);
    }
  }, [profile]);

  const firstName = watch('firstName');
  const avatarUrl = watch('avatarUrl');

  const onSubmit = (data) => {
    updateProfile({ ...data, avatar: avatarUploadRef.current.files[0] });
  };

  const handleAvatarClick = () => {
    avatarUploadRef.current.click();
  };

  const handleAvatarFileInputChange = (e) => {
    if (e.target.files[0]) {
      setValue('avatarUrl', URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <>
      <input
        type="file"
        id="avatar"
        ref={avatarUploadRef}
        onChange={handleAvatarFileInputChange}
        style={{ display: 'none' }}
      />
      <div className="flex justify-center">
        <div className="cursor-pointer" onClick={handleAvatarClick}>
          <Avatar
            avatarUrl={avatarUrl}
            size={200}
            alt={`${firstName} avatar`}
          />
          <div type="button" className="text-center my-5 bg-gray-100 p-2">
            Change avatar
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="pb-12">
        <div className="my-5">
          <Controller
            name="firstName"
            control={control}
            rules={{ required: { value: true, message: 'Required' } }}
            render={({ field }) => (
              <TextField
                fullWidth
                {...field}
                disabled={savingProfile || loadingProfile}
                error={!!errors.firstName}
                helperText={errors.firstName ? errors.firstName.message : ''}
                label="First name"
              />
            )}
          />
        </div>
        <div className="my-5">
          <Controller
            name="lastName"
            control={control}
            rules={{ required: { value: true, message: 'Required' } }}
            render={({ field }) => (
              <TextField
                fullWidth
                {...field}
                rules={{ required: { value: true, message: 'Required' } }}
                disabled={savingProfile || loadingProfile}
                error={!!errors.lastName}
                helperText={errors.lastName ? errors.lastName.message : ''}
                label="Last name"
              />
            )}
          />
        </div>

        <div className="my-5">
          <Controller
            name="avatarUrl"
            rules={{
              pattern: {
                value: urlRegex,
                message:
                  'Does not look like a proper url (ex : https://reactjs.org)',
              },
            }}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                disabled={savingProfile || loadingProfile}
                error={!!errors.avatarUrl}
                helperText={errors.avatarUrl ? errors.avatarUrl.message : ''}
                label="Avatar URL"
              />
            )}
          />
        </div>

        <div className="my-5">
          <Controller
            name="meetUrl"
            rules={{
              pattern: {
                value: urlRegex,
                message:
                  'Does not look like a proper url (ex : https://meet.google.com/xvh-ngny-aaa)',
              },
            }}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                disabled={savingProfile || loadingProfile}
                label="Meet URL"
                error={!!errors.meetUrl}
                helperText={errors.meetUrl ? errors.meetUrl.message : ''}
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
                disabled={savingProfile || loadingProfile}
              />
            )}
          />
        </div>
        <div className="my-8">
          <Button
            disabled={savingProfile || loadingProfile}
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
}
