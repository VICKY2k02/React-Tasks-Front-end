import React from "react";
import UserProfileCards from "./UserProfileCards";
import image from "./image.jpeg";

export default UserProfileCard1;
function UserProfileCard1(){
    return(
        <div>
            <UserProfileCards
            image={image}
            name="G.Vikas Kumar"
            role="Associate Software Engineer"
            bio="Front-end & Back-end Developer, Passionate about buiilding Web Applications & Web Designing."
            />
        </div>
    );
}
