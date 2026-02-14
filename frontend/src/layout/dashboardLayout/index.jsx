import { getAllUsers, getUserProfile } from "@/config/redux/action/authAction";
import { getAllPost } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authState.all_Profile_fetch) {
      dispatch(getAllUsers());
    }
  }, [dispatch, router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      dispatch(getUserProfile({ token }));
      dispatch(getAllPost());
      setReady(true);
    }
  }, [dispatch, router]);

  const navigationItems = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"/>
        </svg>
      ),
      label: "Home",
      path: "/dashboard",
      isActive: router.pathname === "/dashboard"
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      ),
      label: "Discover",
      path: "/discover",
      isActive: router.pathname === "/discover"
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0-2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7.5 3.5c0 2-2 2-2 2h-11s-2 0-2-2c0-1 0-4.5 7.5-4.5s7.5 3.5 7.5 4.5z"/>
        </svg>
      ),
      label: "My Network",
      path: "/myConnection",
      isActive: router.pathname === "/myConnection"
    }
  ];

  if (!ready) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f3f2ef'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #0a66c2',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#666', fontSize: '14px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f3f2ef',
      minHeight: '100vh',
      paddingTop: '72px'
    }}>
      <div style={{
        maxWidth: '1128px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '225px 1fr 300px',
        gap: '24px',
        padding: '24px 16px'
      }}>
        

        <div style={{
          position: 'sticky',
          top: '96px',
          height: 'fit-content'
        }}>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            marginBottom: '16px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '54px',
              background: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '48px',
                height: '48px',
                backgroundColor: '#0a66c2',
                borderRadius: '50%',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {authState?.user?.userId?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div style={{ padding: '32px 16px 16px', textAlign: 'center' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 4px',
                color: '#000'
              }}>
                {authState?.user?.userId?.name || authState?.user?.userId?.username}
              </h3>
              <p style={{
                fontSize: '12px',
                color: '#666',
                margin: '0 0 12px',
                lineHeight: '1.33'
              }}>
                Professional | Networking
              </p>
              
              <div style={{
                borderTop: '1px solid #e0e0e0',
                paddingTop: '12px',
                marginTop: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '4px'
                }}>
                  <span>Profile viewers</span>
                  <span style={{ color: '#0a66c2', fontWeight: '600' }}>42</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  <span>Post impressions</span>
                  <span style={{ color: '#0a66c2', fontWeight: '600' }}>1,204</span>
                </div>
              </div>
            </div>
          </div>

       
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            padding: '16px 0'
          }}>
            {navigationItems.map((item, index) => (
              <div
                key={index}
                onClick={() => router.push(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  color: item.isActive ? '#0a66c2' : '#666',
                  backgroundColor: item.isActive ? 'rgba(10, 102, 194, 0.1)' : 'transparent',
                  borderRight: item.isActive ? '2px solid #0a66c2' : '2px solid transparent',
                  fontSize: '14px',
                  fontWeight: item.isActive ? '600' : '400',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!item.isActive) {
                    e.target.style.backgroundColor = '#f3f2ef';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.isActive) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ marginRight: '12px', display: 'flex' }}>
                  {item.icon}
                </span>
                {item.label}
              </div>
            ))}
          </div>
        </div>

     
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          padding: '20px',
          minHeight: '400px'
        }}>
          {children}
        </div>

        {/* Right Sidebar */}
        <div style={{
          position: 'sticky',
          top: '96px',
          height: 'fit-content'
        }}>
          {/* People You May Know */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            marginBottom: '16px'
          }}>
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: '0',
                color: '#000'
              }}>
                People you may know
              </h3>
            </div>
            
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              {authState.all_Profiles && authState.all_Profiles.slice(0, 5).map((profile, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: index < Math.min(authState.all_Profiles.length - 1, 4) ? '1px solid #e0e0e0' : 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f2ef'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#0a66c2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginRight: '12px',
                    flexShrink: 0
                  }}>
                    {profile.userId.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 4px',
                      color: '#000',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {profile.userId.name}
                    </h4>
                    <p style={{
                      fontSize: '12px',
                      color: '#666',
                      margin: '0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      Professional Network
                    </p>
                  </div>
                  
                  <button style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #0a66c2',
                    color: '#0a66c2',
                    padding: '4px 16px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#0a66c2';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#0a66c2';
                  }}
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>
            
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid #e0e0e0',
              textAlign: 'center'
            }}>
              <button
                onClick={() => router.push('/discover')}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#666',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '4px 0',
                  outline: 'none',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#0a66c2'}
                onMouseLeave={(e) => e.target.style.color = '#666'}
              >
                Show all →
              </button>
            </div>
          </div>

          {/* LinkedIn News */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: '0',
                color: '#000'
              }}>
                LinkedIn News
              </h3>
            </div>
            
            <div style={{ padding: '12px 16px' }}>
              {[
                "Tech hiring rebounds strongly",
                "Remote work policies evolving",
                "AI skills in high demand",
                "Networking events return",
                "Career growth strategies"
              ].map((news, index) => (
                <div key={index} style={{
                  padding: '8px 0',
                  borderBottom: index < 4 ? '1px solid #e0e0e0' : 'none',
                  cursor: 'pointer'
                }}>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    margin: '0 0 4px',
                    color: '#000',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#0a66c2'}
                  onMouseLeave={(e) => e.target.style.color = '#000'}
                  >
                    {news}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#666',
                    margin: '0'
                  }}>
                    {Math.floor(Math.random() * 1000) + 100} readers
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;