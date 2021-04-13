export default function GroupList({ groups }) {
  return (
    <div className="flex flex-wrap">
      {groups.map((group) => {
        return (
          <div key={group.name} className="p-5 mr-5 mb-5 w-32 bg-gray-300">
            <h2 className="text-xl">{group.name}</h2>
            <ul>
              {group.members.map((member) => {
                return <li key={member.firstName}>{member.firstName}</li>;
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
