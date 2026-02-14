import mongoose from "mongoose";

const educationSchema = mongoose.Schema({
  school: { type: String, default: "" },
  degree: { type: String, default: "" },
  fieldOfStudy: { type: String, default: "" },
  startYear: { type: String, default: "" },
  endYear: { type: String, default: "" },
  grade: { type: String, default: "" },
  description: { type: String, default: "" }
});

const workSchema = mongoose.Schema({
  company: { type: String, default: "" },
  position: { type: String, default: "" },
  from: { type: String, default: "" },
  to: { type: String, default: "" },
  description: { type: String, default: "" },
  location: { type: String, default: "" }
});

const certificationSchema = mongoose.Schema({
  name: { type: String, default: "" },
  issuingOrganization: { type: String, default: "" },
  issueDate: { type: String, default: "" },
  credentialId: { type: String, default: "" },
  credentialURL: { type: String, default: "" }
});

const socialLinksSchema = mongoose.Schema({
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" },
  portfolio: { type: String, default: "" },
  twitter: { type: String, default: "" }
});

const profileSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    },
    bio: { type: String, default: "" },
    headline: { type: String, default: "" },
    currentPost: { type: String, default: "" },
    location: { type: String, default: "" },
   

    skills: {
      type: [String],
      default: []
    },
    achievements: {
      type: [String],
      default: []
    },

    socialLinks: {
      type: socialLinksSchema,
      default: () => ({})
    },

    certifications: {
      type: [certificationSchema],
      default: []
    },

    pastWork: {
      type: [workSchema],
      default: []
    },

    education: {
      type: [educationSchema],
      default: []
    }
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
