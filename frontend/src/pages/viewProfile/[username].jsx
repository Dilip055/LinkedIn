import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BASE_URL, clientServer } from "@/config";
import Userlayout from "@/layout/userLayout";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllPost } from "@/config/redux/action/postAction";
import { getConnectionRequest, getUserProfile, sendConnectionRequest } from "@/config/redux/action/authAction";

const toCsv = (arr) => (Array.isArray(arr) ? arr.filter(Boolean).join(", ") : "");
const fromCsv = (text) => text.split(",").map((x) => x.trim()).filter(Boolean);
const imageSrc = (v) =>
  !v ? "" : v.startsWith("http://") || v.startsWith("https://") || v.startsWith("data:") ? v : `${BASE_URL}/uploads/${v}`;
const emptyWork = { company: "", position: "", from: "", to: "", description: "", location: "" };
const emptyEducation = { school: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "", grade: "", description: "" };
const emptyCertification = { name: "", issuingOrganization: "", issueDate: "", credentialId: "", credentialURL: "" };

const ViewProfile = ({ profile }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.post);
  const authState = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState(profile || {});
  const [userPosts, setUserPosts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({});
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const canEdit = Boolean(authState?.user?.userId?._id && profileData?.userId?._id && authState.user.userId._id === profileData.userId._id);

  const openEditor = () => {
    setForm({
      name: profileData?.userId?.name || "",
      username: profileData?.userId?.username || "",
      email: profileData?.userId?.email || "",
      headline: profileData?.headline || "",
      currentPost: profileData?.currentPost || "",
      location: profileData?.location || "",
      bio: profileData?.bio || "",
      skills: Array.isArray(profileData?.skills) ? profileData.skills : [],
      skillQuery: "",
      achievementsText: toCsv(profileData?.achievements),
      linkedin: profileData?.socialLinks?.linkedin || "",
      github: profileData?.socialLinks?.github || "",
      portfolio: profileData?.socialLinks?.portfolio || "",
      twitter: profileData?.socialLinks?.twitter || "",
      pastWork: Array.isArray(profileData?.pastWork) && profileData.pastWork.length ? profileData.pastWork : [{ ...emptyWork }],
      education: Array.isArray(profileData?.education) && profileData.education.length ? profileData.education : [{ ...emptyEducation }],
      certifications:
        Array.isArray(profileData?.certifications) && profileData.certifications.length
          ? profileData.certifications
          : [{ ...emptyCertification }],
    });
    setPhoto(null);
    setIsEditing(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(getUserProfile({ token }));
    dispatch(getAllPost());
    dispatch(getConnectionRequest(token));
  }, [dispatch]);

  useEffect(() => {
    if (!postState.posts || !router.query.username) return;
    setUserPosts(postState.posts.filter((item) => item.userId?.username === router.query.username));
  }, [postState.posts, router.query.username]);

  useEffect(() => {
    if (!authState.connectionRequest || !profileData?.userId?._id) return;
    setIsConnected(authState.connectionRequest.some((item) => item.connectionId?._id === profileData.userId._id));
  }, [authState.connectionRequest, profileData]);

  useEffect(() => {
    if (!isEditing) return;
    const q = String(form.location || "").trim();
    if (q.length < 2) {
      setLocationSuggestions([]);
      return;
    }

    let active = true;
    const timer = setTimeout(async () => {
      try {
        const response = await clientServer.get("/search_locations", {
          params: { q },
        });
        if (active) {
          setLocationSuggestions(response?.data?.locations || []);
        }
      } catch {
        if (active) setLocationSuggestions([]);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [isEditing, form.location]);

  const updateField = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const updateListField = (listName, index, field, value) => {
    setForm((prev) => ({
      ...prev,
      [listName]: (prev[listName] || []).map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };
  const addListItem = (listName, template) => {
    setForm((prev) => ({ ...prev, [listName]: [...(prev[listName] || []), { ...template }] }));
  };
  const removeListItem = (listName, index) => {
    setForm((prev) => ({ ...prev, [listName]: (prev[listName] || []).filter((_, i) => i !== index) }));
  };
  const addSkill = (value) => {
    const skill = String(value || "").trim();
    if (!skill) return;
    setForm((prev) => {
      const current = prev.skills || [];
      const exists = current.some((x) => String(x).toLowerCase() === skill.toLowerCase());
      if (exists) return { ...prev, skillQuery: "" };
      return { ...prev, skills: [...current, skill], skillQuery: "" };
    });
  };
  const removeSkill = (index) => {
    setForm((prev) => ({ ...prev, skills: (prev.skills || []).filter((_, i) => i !== index) }));
  };

  const uploadPhoto = async () => {
    const token = localStorage.getItem("token");
    if (!token || !photo) return;
    const data = new FormData();
    data.append("token", token);
    data.append("profilePicture", photo);
    try {
      setUploading(true);
      await clientServer.post("/profile_picture", data, { headers: { "Content-Type": "multipart/form-data" } });
      setProfileData((prev) => ({ ...prev, userId: { ...prev.userId, profilePicture: photo.name } }));
      dispatch(getUserProfile({ token }));
      toast("Profile picture updated");
    } catch (error) {
      toast(error?.response?.data?.message || "Photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const cleanedWork = (form.pastWork || []).filter((x) => Object.values(x || {}).some(Boolean));
    const cleanedEducation = (form.education || []).filter((x) => Object.values(x || {}).some(Boolean));
    const cleanedCertifications = (form.certifications || []).filter((x) => Object.values(x || {}).some(Boolean));
    const userPayload = {
      token,
      name: form.name,
      username: form.username,
      email: form.email,
    };
    const profilePayload = {
      token,
      headline: form.headline,
      currentPost: form.currentPost,
      location: form.location,
      bio: form.bio,
      skills: form.skills || [],
      achievements: fromCsv(form.achievementsText || ""),
      socialLinks: { linkedin: form.linkedin, github: form.github, portfolio: form.portfolio, twitter: form.twitter },
      pastWork: cleanedWork,
      education: cleanedEducation,
      certifications: cleanedCertifications,
    };
    try {
      setIsSaving(true);
      await clientServer.post("/updateUserProfile", userPayload);
      await clientServer.post("/user_profile_update", profilePayload);
      const { token: _tokenUser, ...userFields } = userPayload;
      const { token: _tokenProfile, ...profileFields } = profilePayload;
      setProfileData((prev) => ({
        ...prev,
        ...profileFields,
        userId: {
          ...prev.userId,
          ...userFields,
        },
      }));
      setIsEditing(false);
      toast("Profile updated");
    } catch (error) {
      toast(error?.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Userlayout>
      <div className="container mt-4">
        <div style={{ height: "180px", background: "linear-gradient(90deg, #0a66c2, #004182)", borderRadius: "10px 10px 0 0" }} />
        <div className="bg-white p-4 shadow-sm position-relative">
          <img src={imageSrc(profileData?.userId?.profilePicture)} alt="profile" style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "4px solid white", position: "absolute", top: -60, left: 30 }} />
          <div style={{ marginLeft: 170 }}>
            <h3 className="fw-bold">{profileData?.userId?.name}</h3>
            <p className="text-muted mb-1">@{profileData?.userId?.username}</p>
            <p className="mb-1">{profileData?.headline || "No headline"}</p>
            <p className="text-muted mb-1">{profileData?.currentPost || "No current role"}</p>
            <p className="text-muted">{profileData?.location || "No location"}</p>
            {canEdit ? (
              <button className="btn btn-outline-primary me-2" onClick={openEditor}>Edit Profile</button>
            ) : !isConnected ? (
              <button className="btn btn-primary me-2" onClick={() => dispatch(sendConnectionRequest({ token: localStorage.getItem("token"), connectionId: profileData.userId._id }))}>Connect</button>
            ) : <button className="btn btn-success me-2">Connected</button>}
          </div>
        </div>

        <div className="bg-white shadow-sm p-4 mt-3 rounded"><h5 className="fw-bold">About</h5><p className="mb-0 text-muted">{profileData?.bio || "No information added"}</p></div>
        <div className="bg-white shadow-sm p-4 mt-3 rounded"><h5 className="fw-bold">Skills</h5><p className="mb-0 text-muted">{toCsv(profileData?.skills) || "No skills added"}</p></div>
        <div className="bg-white shadow-sm p-4 mt-3 rounded"><h5 className="fw-bold">Achievements</h5><p className="mb-0 text-muted">{toCsv(profileData?.achievements) || "No achievements added"}</p></div>
        <div className="bg-white shadow-sm p-4 mt-3 rounded">
          <h5 className="fw-bold">Experience</h5>
          {(profileData?.pastWork || []).length ? (
            (profileData.pastWork || []).map((item, index) => (
              <div key={`exp-${index}`} className="border-bottom py-2">
                <div className="fw-semibold">{item.position || "Position"}</div>
                <div>{item.company || "Company"}</div>
                <div className="text-muted">{[item.from, item.to].filter(Boolean).join(" - ")}</div>
              </div>
            ))
          ) : (
            <p className="text-muted mb-0">No experience added</p>
          )}
        </div>
        <div className="bg-white shadow-sm p-4 mt-3 rounded">
          <h5 className="fw-bold">Education</h5>
          {(profileData?.education || []).length ? (
            (profileData.education || []).map((item, index) => (
              <div key={`edu-${index}`} className="border-bottom py-2">
                <div className="fw-semibold">{item.school || "School"}</div>
                <div>{[item.degree, item.fieldOfStudy].filter(Boolean).join(", ")}</div>
                <div className="text-muted">{[item.startYear, item.endYear].filter(Boolean).join(" - ")}</div>
              </div>
            ))
          ) : (
            <p className="text-muted mb-0">No education added</p>
          )}
        </div>
        <div className="bg-white shadow-sm p-4 mt-3 rounded">
          <h5 className="fw-bold">Certifications</h5>
          {(profileData?.certifications || []).length ? (
            (profileData.certifications || []).map((item, index) => (
              <div key={`cert-${index}`} className="border-bottom py-2">
                <div className="fw-semibold">{item.name || "Certification"}</div>
                <div>{item.issuingOrganization || "Organization"}</div>
                <div className="text-muted">{item.issueDate || ""}</div>
              </div>
            ))
          ) : (
            <p className="text-muted mb-0">No certifications added</p>
          )}
        </div>
        <div className="bg-white shadow-sm p-4 mt-3 rounded"><h5 className="fw-bold">Posts</h5>{userPosts.length ? userPosts.map((p) => <div key={p._id} className="border-bottom py-2">{p.body}</div>) : <p className="text-muted mb-0">No posts available</p>}</div>
      </div>

      {canEdit && isEditing && (
        <div onClick={() => setIsEditing(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded p-4" style={{ width: "100%", maxWidth: 900, maxHeight: "90vh", overflowY: "auto" }}>
            <div className="d-flex justify-content-between align-items-center mb-3"><h5 className="fw-bold mb-0">Edit Full Profile</h5><button className="btn btn-sm btn-outline-secondary" onClick={() => setIsEditing(false)}>Close</button></div>
            <div className="mb-3">
              <label className="form-label">Profile Picture</label>
              <div className="d-flex gap-2"><input className="form-control" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} /><button className="btn btn-outline-primary" disabled={uploading} onClick={uploadPhoto}>{uploading ? "Uploading..." : "Upload"}</button></div>
            </div>
            <div className="row g-3">
              <div className="col-md-4"><label className="form-label">Name</label><input className="form-control" name="name" value={form.name || ""} onChange={updateField} /></div>
              <div className="col-md-4"><label className="form-label">Username</label><input className="form-control" name="username" value={form.username || ""} onChange={updateField} /></div>
              <div className="col-md-4"><label className="form-label">Email</label><input className="form-control" name="email" value={form.email || ""} onChange={updateField} /></div>
              <div className="col-md-6"><label className="form-label">Headline</label><input className="form-control" name="headline" value={form.headline || ""} onChange={updateField} /></div>
              <div className="col-md-6"><label className="form-label">Current Position</label><input className="form-control" name="currentPost" value={form.currentPost || ""} onChange={updateField} /></div>
              <div className="col-md-6"><label className="form-label">Location</label><input list="location-suggestions" className="form-control" name="location" value={form.location || ""} onChange={updateField} /></div>
              <div className="col-12"><label className="form-label">About</label><textarea className="form-control" rows={3} name="bio" value={form.bio || ""} onChange={updateField} /></div>
              <div className="col-12">
                <label className="form-label">Skills</label>
                <div className="d-flex gap-2 mb-2">
                  <input
                    className="form-control"
                    placeholder="Type a skill"
                    name="skillQuery"
                    value={form.skillQuery || ""}
                    onChange={updateField}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(form.skillQuery);
                      }
                    }}
                  />
                  <button type="button" className="btn btn-outline-primary" onClick={() => addSkill(form.skillQuery)}>
                    Add Skill
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {(form.skills || []).map((skill, index) => (
                    <span key={`${skill}-${index}`} className="badge bg-primary d-inline-flex align-items-center">
                      {skill}
                      <button
                        type="button"
                        className="btn btn-sm text-white border-0 p-0 ms-2"
                        onClick={() => removeSkill(index)}
                        style={{ lineHeight: 1 }}
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-12"><label className="form-label">Achievements (comma separated)</label><textarea className="form-control" rows={2} name="achievementsText" value={form.achievementsText || ""} onChange={updateField} /></div>
              <div className="col-md-6"><label className="form-label">LinkedIn URL</label><input className="form-control" name="linkedin" value={form.linkedin || ""} onChange={updateField} /></div>
              <div className="col-md-6"><label className="form-label">GitHub URL</label><input className="form-control" name="github" value={form.github || ""} onChange={updateField} /></div>
              <div className="col-md-6"><label className="form-label">Portfolio URL</label><input className="form-control" name="portfolio" value={form.portfolio || ""} onChange={updateField} /></div>
              <div className="col-md-6"><label className="form-label">Twitter URL</label><input className="form-control" name="twitter" value={form.twitter || ""} onChange={updateField} /></div>
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label mb-0">Experience</label>
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addListItem("pastWork", emptyWork)}>Add</button>
                </div>
                {(form.pastWork || []).map((item, index) => (
                  <div key={`work-${index}`} className="border rounded p-2 mt-2">
                    <div className="row g-2">
                      <div className="col-md-6"><input className="form-control" placeholder="Company" value={item.company || ""} onChange={(e) => updateListField("pastWork", index, "company", e.target.value)} /></div>
                      <div className="col-md-6"><input className="form-control" placeholder="Position" value={item.position || ""} onChange={(e) => updateListField("pastWork", index, "position", e.target.value)} /></div>
                      <div className="col-md-4"><input type="date" className="form-control" placeholder="From" value={item.from || ""} onChange={(e) => updateListField("pastWork", index, "from", e.target.value)} /></div>
                      <div className="col-md-4"><input type="date" className="form-control" placeholder="To" value={item.to || ""} onChange={(e) => updateListField("pastWork", index, "to", e.target.value)} /></div>
                      <div className="col-md-4"><input list="location-suggestions" className="form-control" placeholder="Location" value={item.location || ""} onChange={(e) => updateListField("pastWork", index, "location", e.target.value)} /></div>
                      <div className="col-12"><textarea className="form-control" rows={2} placeholder="Description" value={item.description || ""} onChange={(e) => updateListField("pastWork", index, "description", e.target.value)} /></div>
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-danger mt-2" onClick={() => removeListItem("pastWork", index)}>Remove</button>
                  </div>
                ))}
              </div>
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label mb-0">Education</label>
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addListItem("education", emptyEducation)}>Add</button>
                </div>
                {(form.education || []).map((item, index) => (
                  <div key={`edu-${index}`} className="border rounded p-2 mt-2">
                    <div className="row g-2">
                      <div className="col-md-6"><input className="form-control" placeholder="School" value={item.school || ""} onChange={(e) => updateListField("education", index, "school", e.target.value)} /></div>
                      <div className="col-md-6"><input className="form-control" placeholder="Degree" value={item.degree || ""} onChange={(e) => updateListField("education", index, "degree", e.target.value)} /></div>
                      <div className="col-md-6"><input className="form-control" placeholder="Field of Study" value={item.fieldOfStudy || ""} onChange={(e) => updateListField("education", index, "fieldOfStudy", e.target.value)} /></div>
                      <div className="col-md-3"><input type="date" className="form-control" placeholder="Start Date" value={item.startYear || ""} onChange={(e) => updateListField("education", index, "startYear", e.target.value)} /></div>
                      <div className="col-md-3"><input type="date" className="form-control" placeholder="End Date" value={item.endYear || ""} onChange={(e) => updateListField("education", index, "endYear", e.target.value)} /></div>
                      <div className="col-md-6"><input className="form-control" placeholder="Grade" value={item.grade || ""} onChange={(e) => updateListField("education", index, "grade", e.target.value)} /></div>
                      <div className="col-12"><textarea className="form-control" rows={2} placeholder="Description" value={item.description || ""} onChange={(e) => updateListField("education", index, "description", e.target.value)} /></div>
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-danger mt-2" onClick={() => removeListItem("education", index)}>Remove</button>
                  </div>
                ))}
              </div>
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label mb-0">Certifications</label>
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addListItem("certifications", emptyCertification)}>Add</button>
                </div>
                {(form.certifications || []).map((item, index) => (
                  <div key={`cert-${index}`} className="border rounded p-2 mt-2">
                    <div className="row g-2">
                      <div className="col-md-6"><input className="form-control" placeholder="Name" value={item.name || ""} onChange={(e) => updateListField("certifications", index, "name", e.target.value)} /></div>
                      <div className="col-md-6"><input className="form-control" placeholder="Issuing Organization" value={item.issuingOrganization || ""} onChange={(e) => updateListField("certifications", index, "issuingOrganization", e.target.value)} /></div>
                      <div className="col-md-4"><input type="date" className="form-control" placeholder="Issue Date" value={item.issueDate || ""} onChange={(e) => updateListField("certifications", index, "issueDate", e.target.value)} /></div>
                      <div className="col-md-4"><input className="form-control" placeholder="Credential ID" value={item.credentialId || ""} onChange={(e) => updateListField("certifications", index, "credentialId", e.target.value)} /></div>
                      <div className="col-md-4"><input className="form-control" placeholder="Credential URL" value={item.credentialURL || ""} onChange={(e) => updateListField("certifications", index, "credentialURL", e.target.value)} /></div>
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-danger mt-2" onClick={() => removeListItem("certifications", index)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
            <datalist id="location-suggestions">
              {locationSuggestions.map((location) => (
                <option key={location} value={location} />
              ))}
            </datalist>
            <div className="mt-3 d-flex gap-2">
              <button className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={isSaving} onClick={saveProfile}>{isSaving ? "Saving..." : "Save All Changes"}</button>
            </div>
          </div>
        </div>
      )}
    </Userlayout>
  );
};

export default ViewProfile;

export async function getServerSideProps(context) {
  const { username } = context.params;
  const request = await clientServer.get(`/getUserProfileBasedOnUsername?username=${username}`);
  return { props: { profile: request.data.profile } };
}
