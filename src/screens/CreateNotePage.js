import { useForm } from 'react-hook-form';
import API from '../APIClient';

export default function CreateNotePage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    API.post('/notes', data).then(() => {
      alert('saved !');
    });
  };

  return (
    <div>
      <h2 className="text-3xl text-center">Create a new note</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="title">
          Title :<input {...register('title')} />
        </label>
        <br />
        <label htmlFor="content">
          Content :<textarea {...register('content')} />
        </label>
        <br />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
