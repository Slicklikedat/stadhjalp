import type { FamilyMember } from '../types';

// Describes which props MemberList expects to receive
interface MemberListProps {
    members: FamilyMember[];                // Everyone in the family
    onDelete: (memberId: number) => void;   // Function from App, called when "Ta bort" is clicked
}

// Shows every family member with their color and a delete button
function MemberList({ members, onDelete }: MemberListProps) {
    return (
        <section className="member-list">
            <h2>Familjen</h2>

            <ul>
                {members.map((member) => (
                    <li key={member.id}>
                        {/* The same colored dot as on the task cards */}
                        <span className="member">
                            <span
                                className="member-dot"
                                style={{ backgroundColor: member.color }}
                                aria-hidden="true"
                            />
                            {member.name}
                        </span>

                        {/* aria-label says WHO is removed, e.g. "Ta bort Pappa test" */}
                        <button onClick={() => onDelete(member.id)} aria-label={`Ta bort ${member.name}`}>
                            Ta bort
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default MemberList;