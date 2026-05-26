import React, {useState} from "react";
import "./userCards.css"

export default function UserCard({ user }) {

  {/*useState for button toggle:--- */}
  const [isFollowing, setIsFollowing] = useState(false);

  {/**Toggle button:--- */}
  const handleFollow = () =>
    setIsFollowing(!isFollowing)
  

  return (
    <div className="card">
      <img
        src={`https://i.pravatar.cc/150?img=${user.id}`}
        alt={user.name}
        className="profile-image"/>

      <h2>{user.name}</h2>

      <p><b>Email:</b> {user.email}</p>

      <p><b>Company:</b> {user.company.name}</p>

      

      <button className="connect-btn" onClick={handleFollow}>
                    {isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}
