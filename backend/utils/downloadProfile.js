import PDFDocument from "pdfkit";
import fs from "fs";
import crypto from "crypto";
import path from "path";

const convertUserDataToPDF = (userData) => {
  const doc = new PDFDocument({ margin: 50 });
  const outPutPath = crypto.randomBytes(16).toString("hex") + ".pdf";
  const fullPath = path.join("uploads", outPutPath);
  const stream = fs.createWriteStream(fullPath);
  doc.pipe(stream);

  // ----------- Profile Picture -----------
  const fileExtension = path.extname(userData.userId.profilePicture || "").toLowerCase();
  const imagePath = path.join("uploads", userData.userId.profilePicture || "");

  if (
    userData.userId.profilePicture &&
    fs.existsSync(imagePath) &&
    [".png", ".jpg", ".jpeg"].includes(fileExtension)
  ) {
    doc.image(imagePath, 50, 50, { width: 100, height: 100, fit: [100, 100], align: "center" });
  }

  // ----------- Name & Email -----------
  doc.fontSize(22).fillColor("#333").text(userData.userId.username || "Unnamed", 170, 50, { continued: false, underline: true });
  doc.fontSize(12).fillColor("#555").text(userData.userId.email || "No email provided", 170, 80);
  doc.fontSize(12).text(`Location: ${userData.location || "Not specified"}`, 170, 100);
  doc.moveDown(2);

  // ----------- Headline & Bio -----------
  doc.fontSize(16).fillColor("#000").text("Headline", { underline: true });
  doc.fontSize(12).fillColor("#555").text(userData.headline || "Not provided");
  doc.moveDown(0.5);

  doc.fontSize(16).fillColor("#000").text("Bio", { underline: true });
  doc.fontSize(12).fillColor("#555").text(userData.bio || "Not provided");
  doc.moveDown();

  // ----------- Skills -----------
  if (userData.skills && userData.skills.length > 0) {
    doc.fontSize(16).fillColor("#000").text("Skills", { underline: true });
    doc.fontSize(12).fillColor("#555").text(userData.skills.join(", "));
    doc.moveDown();
  }

  // ----------- Achievements -----------
  if (userData.achievements && userData.achievements.length > 0) {
    doc.fontSize(16).fillColor("#000").text("Achievements", { underline: true });
    userData.achievements.forEach((a, i) => {
      doc.fontSize(12).fillColor("#555").text(`${i + 1}. ${a}`);
    });
    doc.moveDown();
  }

  // ----------- Education -----------
  if (userData.education && userData.education.length > 0) {
    doc.addPage(); // optional new page for education
    doc.fontSize(16).fillColor("#000").text("Education", { underline: true });
    userData.education.forEach((edu) => {
      doc.fontSize(12).fillColor("#333").text(`${edu.degree || "Degree"} in ${edu.fieldOfStudy || ""}`);
      doc.fontSize(12).fillColor("#555").text(`${edu.school || "School"} (${edu.startYear || ""} - ${edu.endYear || ""})`);
      if (edu.grade) doc.fontSize(11).fillColor("#555").text(`Grade: ${edu.grade}`);
      if (edu.description) doc.fontSize(11).fillColor("#555").text(edu.description);
      doc.moveDown();
    });
  }

  // ----------- Work Experience -----------
  if (userData.pastWork && userData.pastWork.length > 0) {
    doc.addPage(); // optional new page for work experience
    doc.fontSize(16).fillColor("#000").text("Work Experience", { underline: true });
    userData.pastWork.forEach((work) => {
      doc.fontSize(12).fillColor("#333").text(`${work.position || "Position"} at ${work.company || "Company"}`);
      doc.fontSize(12).fillColor("#555").text(`(${work.from || ""} - ${work.to || ""}) | ${work.location || "Location not specified"}`);
      if (work.description) doc.fontSize(11).fillColor("#555").text(work.description);
      doc.moveDown();
    });
  }

  // ----------- Certifications -----------
  if (userData.certifications && userData.certifications.length > 0) {
    doc.fontSize(16).fillColor("#000").text("Certifications", { underline: true });
    userData.certifications.forEach((cert) => {
      doc.fontSize(12).fillColor("#555").text(`${cert.name || "Certification"} by ${cert.issuingOrganization || ""} (${cert.issueDate || ""})`);
      if (cert.credentialId) doc.fontSize(11).fillColor("#555").text(`ID: ${cert.credentialId}`);
      if (cert.credentialURL) doc.fontSize(11).fillColor("blue").text(`URL: ${cert.credentialURL}`);
      doc.moveDown();
    });
  }

  // ----------- Social Links -----------
  const { linkedin, github, twitter, portfolio } = userData.socialLinks || {};
  if (linkedin || github || twitter || portfolio) {
    doc.fontSize(16).fillColor("#000").text("Social Links", { underline: true });
    if (linkedin) doc.fontSize(12).fillColor("blue").text(`LinkedIn: ${linkedin}`);
    if (github) doc.fontSize(12).fillColor("blue").text(`GitHub: ${github}`);
    if (portfolio) doc.fontSize(12).fillColor("blue").text(`Portfolio: ${portfolio}`);
    if (twitter) doc.fontSize(12).fillColor("blue").text(`Twitter: ${twitter}`);
  }

  // ----------- Finish PDF -----------
  doc.end();
  return fullPath;
};

export default convertUserDataToPDF;
