import { searchProfile } from "@/config/redux/action/authAction";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Search = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const { searchProfiles, searchLoading, loggedIn } = useSelector(
    (state) => state.auth,
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      dispatch(searchProfile(debouncedSearch));
    }
  }, [debouncedSearch, dispatch]);

  return (
    <>
      {authState.loggedIn && (
        <div className="ms-5 w-100 position-relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "14px",
              outline: "none",
              width: "100%",
            }}
          />

          {search && (
            <div
              style={{
                position: "absolute",
                top: "45px",
                width: "100%",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 1000,
              }}
            >
              {searchLoading ? (
                <div className="p-3 text-center">Searching...</div>
              ) : searchProfiles?.length > 0 ? (
                searchProfiles.map((profile) => (
                  <div
                    key={profile._id}
                    style={{
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#0a66c2",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      {profile.userId?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div style={{ fontWeight: "600" }}>
                        {profile.userId?.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        @{profile.userId?.username}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center">No users found</div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Search;
