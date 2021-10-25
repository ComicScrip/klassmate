import Avatar from './Avatar';

export default function GroupList({ groups }) {
  return (
    <div className="flex flex-wrap justify-center">
      {groups.map((group) => {
        return (
          <div
            key={group.name}
            className="m-5 bg-blue-200 shadow-lg rounded-lg"
          >
            <h2 className="text-xl p-2 border-b border-blue-50">
              {group.name}
            </h2>
            <ul className="p-5">
              {group.members.map((member) => {
                return (
                  <li key={member.id} className="flex items-center">
                    <Avatar avatarUrl={member.avatarUrl} />
                    <p className="m-5"> {member.firstName}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
