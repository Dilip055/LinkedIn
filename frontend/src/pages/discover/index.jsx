import React, { useEffect } from 'react';
import DashboardLayout from '@/layout/dashboardLayout';
import Userlayout from '@/layout/userLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';

const Discover = () => {
    const dispatch = useDispatch()
    const authState = useSelector((state)=>state.auth)
    const route = useRouter();
    useEffect(()=>{
        if(!authState.all_Profile_fetch){
             dispatch(getAllUsers())
        }
       
    },[dispatch])

  return (
    <Userlayout>
      <DashboardLayout>
        <div className="fs-4 fw-semibold mb-4">Discover</div>
        <div>
          {authState.all_Profile_fetch && authState.all_Profiles.map((profile)=>(
            <div key={profile.userId._id} className="border p-2 mb-2 rounded">
              <div className="d-flex align-items-center">
                <img
                  src={profile.userId.profilePicture}
                  alt="Profile"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                />
                <div>
                  <div className="fw-bold" onClick={()=>route.push(`/viewProfile/${profile.userId.username}`)}>{profile.userId.name}<span className="ms-2" style={{fontSize:"10px", color:"gray"}}>@{profile.userId.username}</span></div>
                  <p className="mb-0 text-muted" style={{fontSize:"12px"}}>{profile.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    </Userlayout>
  );
};

export default Discover;
