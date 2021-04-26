import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../APIClient';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    API.get('/notes').then((res) => setNotes(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-3xl text-center">Notes</h2>
      <Link to="/notes/new">Add new note</Link>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map(({ id, title }) => {
            return (
              <tr key={id}>
                <td>{title}</td>
                <td>edit, delete</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
