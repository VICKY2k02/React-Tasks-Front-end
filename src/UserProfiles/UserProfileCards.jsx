import React, {useState} from "react";
import "./UserProfileCards.css"

export default UserProfileCards;
function UserProfileCards(props){

    {/*Usesatate for button toggle:--- */}
    const [isFollowing, setIsFollowing] = useState(false);

    {/*Toggle Function:--- */}
    const handleFollow = () =>{
        setIsFollowing(!isFollowing);
    };

    return(
        <div id="Card">

            {/*Profile-img:--- */}
            <img src={props.image} alt="Profile" id="profile-img" />
            
            {/*Name:--- */}
            <h2>{props.name}</h2>

            {/*Role:--- */}
            <h4>{props.role}</h4>

            {/*Bio:--- */}
            <p>{props.bio}</p>

            {/*Button:--- */}
            <button onClick={handleFollow}>
                {isFollowing ? "Following" : "Follow"}
            </button>
        </div>
    );
}

