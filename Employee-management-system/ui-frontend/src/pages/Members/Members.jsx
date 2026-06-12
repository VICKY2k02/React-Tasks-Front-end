import {
  useEffect,
  useState
} from "react";

import {
  // getUsers,
  deactivateUser,
  activateUser,
  getMembers
} from "../../services/MemberServices";

import "./Members.css"
import Invitations from "./Invitation";

const Members = () => {

  // const [activeTab,setActiveTab] = useState("users");

  const [members,setMembers] = useState([]);

  const loadMembers = async () => {

    const currentUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!currentUser) {

      console.error(
        "User not found in localStorage"
      );

      return;
    }

    const data = await getMembers(
      currentUser.company_id
    );
    console.log("MEMBERS DATA:", data);
    setMembers(data);
  };

  useEffect(() => {
    loadMembers();
  }, []);



  return (

    <div className="members-container">
       <Invitations />
      <h2 className="members-title">
        Company Members
      </h2>

      <table>

        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Request Status</th>
            <th>Action</th>

            <th>Request Message</th>
          </tr>
        </thead>

        <tbody>

          {
            members.map(
              (member) => (

              <tr key={member.email}>
              <td>{member.email}</td>

              <td>{member.status}</td>

              <td>{member.role}</td>

              <td>{member.reactivation_status || "-"}</td>

             <td>

              {JSON.parse(localStorage.getItem("user"))?.email !== member.email && (

                member.status === "Active" ? (

                  <button
                    className="deactivate-btn"
                    onClick={async () => {

                      await deactivateUser(
                        member.email
                      );

                      loadMembers();
                    }}
                  >
                    Deactivate
                  </button>

                ) : (

                  <button
                    className="activate-btn"
                    onClick={async () => {

                      await activateUser(
                        member.email
                      );

                      loadMembers();
                    }}
                  >
                    Activate
                  </button>

                )

              )}

            </td>

              <td>{member.reason || "-"}</td>
            </tr>

            ))
          }

        </tbody>

      </table>

      

    </div>

  );
};

export default Members;