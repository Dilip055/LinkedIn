import ModalPortal from '@/components/ModalPortal/ModalPortal';
import { BASE_URL } from '@/config';
import { addComment, addLikes, createPost, getAllComments, getAllPost, removeLikes } from '@/config/redux/action/postAction';
import DashboardLayout from '@/layout/dashboardLayout';
import Userlayout from '@/layout/userLayout';
import { formatDistanceToNow } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './dashboard.module.css';
import { resetPostId } from '@/config/redux/reducer/postReducer';

const PostComposer = ({ onCreatePost }) => {
  const [postText, setPostText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (postText.trim() || selectedImage) {
      dispatch(createPost({ body: postText, file: selectedImage }));
      if (onCreatePost) {
        onCreatePost({
          text: postText,
          image: selectedImage,
          timestamp: new Date()
        });
      }

      setPostText('');
      setSelectedImage(null);
      setImagePreview(null);
      setIsExpanded(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      padding: '16px',
      marginBottom: '16px'
    }}>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#0a66c2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          marginRight: '12px'
        }}>
          {authState?.user?.userId?.username?.charAt(0).toUpperCase()}
        </div>

        <div
          onClick={() => setIsExpanded(true)}
          style={{
            flex: 1,
            padding: '16px 20px',
            borderRadius: '35px',
            border: '1px solid #e0e0e0',
            backgroundColor: '#f3f2ef',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#666',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e9e5df';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f3f2ef';
          }}
        >
          Start a post...
        </div>
      </div>


      {!isExpanded && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          paddingTop: '8px'
        }}>
          <button
            onClick={() => setIsExpanded(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#666',
              transition: 'background-color 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f2ef'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <svg width="20" height="20" style={{ marginRight: '8px', fill: '#378fe9' }}>
              <path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
            Photo
          </button>

          <button
            onClick={() => setIsExpanded(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#666',
              transition: 'background-color 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f2ef'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <svg width="20" height="20" style={{ marginRight: '8px', fill: '#5f5f5f' }}>
              <path d="M17 3H5c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-5 6l-3.5 4.5-2.5-3L3 16h12l-3-4z" />
            </svg>
            Event
          </button>

          <button
            onClick={() => setIsExpanded(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#666',
              transition: 'background-color 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f2ef'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <svg width="20" height="20" style={{ marginRight: '8px', fill: '#e16745' }}>
              <path d="M17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 6H9V7h3v2zm3 2v2h-3v-2h3zm-6 2H6v-2h3v2zm0-4H6V7h3v2z" />
            </svg>
            Write article
          </button>
        </div>
      )}


      {isExpanded && (
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#0a66c2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              marginRight: '12px',
              flexShrink: 0
            }}>
              {authState?.user?.userId?.username?.charAt(0).toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginRight: '8px'
                }}>
                  {authState?.user?.userId?.name || authState?.user?.userId?.username}
                </span>

              </div>

              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What do you want to talk about?"
                autoFocus
                style={{
                  width: '100%',
                  minHeight: '120px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  resize: 'none',
                  padding: '0'
                }}
              />


              {imagePreview && (
                <div style={{
                  marginTop: '16px',
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0'
                }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '400px',
                      objectFit: 'cover'
                    }}
                  />
                  <button
                    onClick={removeImage}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      outline: 'none'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>


          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease'
                }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f2ef'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg width="20" height="20" style={{ fill: '#378fe9' }}>
                    <path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                  </svg>
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {postText.length > 0 && (
                <span style={{
                  fontSize: '12px',
                  color: postText.length > 3000 ? '#d11124' : '#666'
                }}>
                  {postText.length}/3000
                </span>
              )}

              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#666',
                  padding: '8px 16px',
                  borderRadius: '24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={!postText.trim() && !selectedImage}
                style={{
                  backgroundColor: (postText.trim() || selectedImage) ? '#0a66c2' : '#e0e0e0',
                  border: 'none',
                  color: (postText.trim() || selectedImage) ? 'white' : '#999',
                  padding: '8px 24px',
                  borderRadius: '24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: (postText.trim() || selectedImage) ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (postText.trim() || selectedImage) {
                    e.target.style.backgroundColor = '#004182';
                  }
                }}
                onMouseLeave={(e) => {
                  if (postText.trim() || selectedImage) {
                    e.target.style.backgroundColor = '#0a66c2';
                  }
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const Dashboard = () => {
  const [commentText, setCommentText] = useState("");
  const [activePostId, setActivePostId] = useState("");
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.post);
  const authState = useSelector((state) => state.auth);
  const comments = postState?.comments || [];
  const user = authState?.user;

  const handleClose = () => {
    setActivePostId("");
    dispatch(resetPostId());
  };

  const handleAddComment = () => {
  if (!commentText.trim()) return;

  const payload={
    token:localStorage.getItem("token"),
    postId:activePostId,
    body:commentText
  }

  dispatch(addComment(payload))

  setCommentText("");
};

  useEffect(() => {
    dispatch(getAllPost());
  }, []);

  return (
    <Userlayout>
      <DashboardLayout>
        <PostComposer />
        <div>
          <div className="w-full max-w-2xl mx-auto mt-8">
            {postState?.isLoading ? (
              <div className="w-full text-center py-10">
                <span className="loader"></span>
              </div>
            ) : postState?.posts?.length > 0 ? (
              <div>
                {postState?.posts?.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      padding: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          backgroundColor: "#0a66c2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "18px",
                          fontWeight: "bold",
                          marginRight: "12px",
                        }}
                      >
                        {post?.userId?.name.charAt(0)}
                      </div>
                      <div>
                        <h4
                          style={{
                            margin: "0",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          {post?.userId?.name}
                        </h4>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "12px",
                            color: "#666",
                          }}
                        >
                          {post?.createdAt
                            ? `${formatDistanceToNow(new Date(post.createdAt))} ago`
                            : "Just now"}
                        </p>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: "16px",
                        lineHeight: "1.5",
                        margin: "0 0 12px",
                      }}
                    >
                      {post?.body}
                    </p>

                    {post?.media && (
                      <img
                        src={`${BASE_URL}/uploads/${post.media}`}
                        alt="Post content"
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "8px",
                          marginBottom: "12px",
                        }}
                      />
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        paddingTop: "12px",
                        borderTop: "1px solid #e0e0e0",
                      }}
                    >
                      <button
                        onClick={() => {
                          post.isLiked
                            ? dispatch(removeLikes(post._id))
                            : dispatch(addLikes(post._id));
                        }}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: post.isLiked ? "#1877f2" : "#666",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          padding: "8px 16px",
                          borderRadius: "4px",
                        }}
                      >
                        <span>{post.isLiked ? "👍🏻" : "👍"}</span>
                        {post.isLiked ? " Unlike" : " Like"} {post.likes}
                      </button>

                      <button
                        onClick={() => {
                          setActivePostId(post._id);
                          dispatch(getAllComments({ postId: post._id }));
                        }}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: "#666",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          padding: "8px 16px",
                          borderRadius: "4px",
                        }}
                      >
                        💬 Comment
                      </button>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: "#666",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          padding: "8px 16px",
                          borderRadius: "4px",
                        }}
                      >
                        🔄 Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {activePostId && (
          <ModalPortal>
            <div className={styles.overlay} onClick={handleClose}>
              <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className={styles.header}>
                  <h2>Comments</h2>
                  <button className={styles.closeBtn} onClick={handleClose}>
                    ✕
                  </button>
                </div>

                {/* Body */}
                <div className={styles.body}>
                  {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment._id} className={styles.commentItem}>
                        <div className={styles.user}>
                          <div className={styles.avatar}>
                            {comment.userId?.profilePicture ? (
                              <img
                                src={comment.userId.profilePicture}
                                alt="user"
                              />
                            ) : (
                              comment.userId?.name?.charAt(0).toUpperCase()
                            )}
                          </div>

                          <div>
                            <span className={styles.name}>
                              {comment.userId?.name || comment.userId?.username}
                            </span>
                            <span className={styles.time}>
                              {comment?.createdAt
                                ? `${formatDistanceToNow(new Date(comment.createdAt))} ago`
                                : "Just now"}
                            </span>
                          </div>
                        </div>

                        <div className={styles.text}>{comment.body}</div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.empty}>No comments yet.</div>
                  )}
                </div>

                {/* Footer (Input box) */}
                <div className={styles.footer}>
                  <div className={styles.inputWrapper}>
                    <div className={styles.inputAvatar}>
                      {user?.userId?.name?.charAt(0).toUpperCase()}
                    </div>

                    <input
                      type="text"
                      className={styles.commentinput}
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddComment();
                      }}
                    />

                    <button
                      className={styles.sendBtn}
                      disabled={!commentText.trim()}
                      onClick={handleAddComment}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ModalPortal>
        )}
      </DashboardLayout>
    </Userlayout>
  );
};

export default Dashboard;
