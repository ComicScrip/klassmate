import React from 'react';
import { useForm } from 'react-hook-form';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    window.console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">
          Email :
          <input
            autoComplete="username"
            type="email"
            {...register('email', {
              required: { value: true, message: 'is Required' },
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'should have email format',
              },
            })}
          />
        </label>
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password">
          Password :
          <input
            autoComplete="current-password"
            type="password"
            {...register('password', {
              required: { value: true, message: 'is Required' },
              minLength: {
                value: 8,
                message: 'should contain at least 8 characters',
              },
            })}
          />
        </label>
        {errors.password && (
          <p className="text-red-600">{errors.password.message}</p>
        )}
      </div>

      <input type="submit" value="OK" />
    </form>
  );
}
