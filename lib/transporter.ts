import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ilya.daraseliya@gmail.com",
    pass: "Marmel89@",
  },
});
