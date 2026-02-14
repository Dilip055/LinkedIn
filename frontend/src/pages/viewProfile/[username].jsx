import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { clientServer } from "@/config";
import Userlayout from "@/layout/userLayout";
import { useDispatch, useSelector } from "react-redux";

import { getAllPost } from "@/config/redux/action/postAction";
import { getConnectionRequest, getUserProfile, sendConnectionRequest } from "@/config/redux/action/authAction";

const ViewProfile = ({ profile }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const postState = useSelector((state) => state.post);
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  /* ================= Fetch Posts & Connections ================= */
  useEffect(() => {
    dispatch(getUserProfile({ token: localStorage.getItem("token") }));
    const fetchData = async () => {
      await getConnectionRequest(localStorage.getItem("token"));
      await dispatch(getAllPost());
      await dispatch(
        getConnectionRequest({
          token: localStorage.getItem("token"),
        })
      );
    };

    fetchData();
  }, [dispatch]);

  /* ================= Filter User Posts ================= */
  useEffect(() => {
    if (!postState.posts || !router.query.username) return;

    const filteredPosts = postState.posts.filter(
      (post) => post.userId?.username === router.query.username
    );

    setUserPosts(filteredPosts);
  }, [postState.posts, router.query.username]);

  /* ================= Check Connection ================= */
  useEffect(() => {
    if (!authState.connections || !profile?.userId?._id) return;
    const isUserConnected = authState.connections.some(
      (conn) => conn.connectionId?._id === profile.userId._id
    );
    setIsConnected(isUserConnected);
  }, [authState.connections, profile]);

  return (
    <Userlayout>
      <div className="container mt-4">

        {/* ===== Banner ===== */}
        <div
          style={{
            height: "200px",
            background: "linear-gradient(90deg, #0a66c2, #004182)",
            borderRadius: "10px 10px 0 0",
            position: "relative",
          }}
        />

        {/* ===== Profile Card ===== */}
        <div className="bg-white p-4 shadow-sm position-relative">

          {/* Avatar */}
          <img
            src={profile.userId.profilePicture}
            alt="profile"
            style={{
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid white",
              position: "absolute",
              top: "-65px",
              left: "30px",
              background: "#fff",
            }}
          />

          {/* Profile Info */}
          <div style={{ marginLeft: "170px" }}>
            <h3 className="fw-bold">{profile.userId.name}</h3>

            <p className="text-muted">
              @{profile.userId.username}
            </p>

            <p className="text-muted">
              {profile.bio || "No bio available"}
            </p>

            {/* Buttons */}
            <div className="mt-3">
              {!isConnected ? (
                <button
                  className="btn btn-primary me-2"
                  onClick={() =>
                    dispatch(
                      sendConnectionRequest({
                        token: localStorage.getItem("token"),
                        connectionId: profile.userId._id,
                      })
                    )
                  }
                >
                  Connect
                </button>
              ) : (
                <button className="btn btn-success me-2">
                  Connected
                </button>
              )}

              <button className="btn btn-outline-secondary">
                Message
              </button>
            </div>
          </div>
        </div>

        {/* ===== About ===== */}
        <div className="bg-white shadow-sm p-4 mt-3 rounded">
          <h5 className="fw-bold">About</h5>
          <p className="text-muted">
            {profile.about || "No information added"}
          </p>
        </div>

        {/* ===== User Posts ===== */}
        <div className="bg-white shadow-sm p-4 mt-3 rounded">
          <h5 className="fw-bold">Posts</h5>

          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div key={post._id} className="border-bottom py-3">
                <p>{post.body}</p>
              </div>
            ))
          ) : (
            <p className="text-muted">No posts available</p>
          )}
        </div>
      </div>
    </Userlayout>
  );
};

export default ViewProfile;

/* ================= SSR ================= */
export async function getServerSideProps(context) {
  const { username } = context.params;

  const request = await clientServer.get(
    `/getUserProfileBasedOnUsername?username=${username}`
  );

  return {
    props: {
      profile: request.data.profile,
    },
  };
}
