import { BASE_URL } from '@/config';
import { acceptRequest, getConnectionRequest } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/dashboardLayout';
import Userlayout from '@/layout/userLayout';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './/myconnection.module.css';
import { useRouter } from 'next/router';

const MyConnection = () => {
  const dispatch = useDispatch();
  const { connectionRequest, searchLoading } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(getConnectionRequest(token));
  }, [dispatch]);

  return (
    <Userlayout>
      <DashboardLayout>
        <div className={styles.container}>
          {searchLoading ? (
            <div className={styles.loading}>Loading connections...</div>
          ) : Array.isArray(connectionRequest) && connectionRequest.length > 0 ? (
            connectionRequest.map((user, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.avatarWrapper}>
                  <img onClick={()=>router.push(`/viewProfile/${user.connectionId.username}`)}
                    className={styles.avatar}
                    src={`${user.connectionId.profilePicture}`}
                    alt={user.userId.name}
                  />
                </div>
                <div className={styles.userInfo}>
                  <h3 className={styles.name}>{user.connectionId.name}</h3>
                  <p className={styles.username}>@{user.connectionId?.username}</p>
                  <button className={styles.connectBtn} onClick={()=>dispatch(acceptRequest({
                    token: localStorage.getItem("token"),
                    requestId: user.connectionId._id,
                    acceptType: "accept",
                  }))}>Accept</button>
                </div>
              </div>
            ))
          ) : (
            <h2 className={styles.noConnections}>No Connections Yet</h2>
          )}
        </div>
      </DashboardLayout>
    </Userlayout>
  );
};

export default MyConnection;
