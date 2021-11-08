import bcrypt from "bcrypt";
import { PrismaClient } from ".prisma/client";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class AuthService {
  prisma: PrismaClient | null;
  transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null;

  constructor({
    prisma,
    transporter,
  }: {
    prisma: PrismaClient;
    transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  }) {
    this.prisma = prisma;
    this.transporter = transporter;
  }

  async resetPassword(email: string) {
    const newPassword = generatePassword();
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma?.user.update({
      where: {
        email,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    await new Promise((resolve, reject) => {
      this.transporter?.sendMail(
        {
          from: "no-reply@mytinylibrary.com",
          to: email,
          subject: "Password reset requested",
          html: `<p>Your new password is: ${newPassword}</p>`,
        },
        function (err, info) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(info);
          }
        }
      );
    });
  }
}

function generatePassword() {
  const length = 16;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
