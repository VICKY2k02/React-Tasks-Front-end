import {
 useEffect,
 useState
} from "react";

import {
 getInvitations,
 createInvitation
}
from "../../services/MemberServices";

import "./Members.css"

const Invitations = () => {

 const [email,setEmail] = useState("");


 const [role,setRole] = useState("user");

 const [invitations, setInvitations] = useState([]);

 const loadInvitations = async () => {

   const data = await getInvitations();

   setInvitations(data);
 };

 useEffect(()=>{
   loadInvitations();
 },[]);

const handleCreate = async () => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  try {

    const result = await createInvitation({
      email,
      role,
      company_id: user.company_id
    });

    console.log("Invite Response:", result);

    await navigator.clipboard.writeText(
      result.link
    );

    alert(
      `Invitation link copied!\n${result.link}`
    );

    loadInvitations();

  } catch (error) {

    console.error(error);

    alert("Failed to create invitation");
  }
};

 return (

 <div className="invitation-container">

   <h2 className="invitation-title">
     Invitations
   </h2>

  <div className="invitation-form">
   <input
    placeholder="Email"
    value={email}
    onChange={(e)=>
      setEmail(e.target.value)
    }
   />

   <select
    value={role}
    onChange={(e)=>
      setRole(e.target.value)
    }
   >
     <option value="user">
       User
     </option>

     <option value="admin">
       Admin
     </option>
   </select>

   <button className="create-btn"
    onClick={handleCreate}
   >
     Create Invite
   </button>

   </div>

 </div>
 );
};

export default Invitations;