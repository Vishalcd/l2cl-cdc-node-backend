import nodemailer from 'nodemailer';
import ejs from 'ejs';
import { htmlToText } from 'html-to-text';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default class Email {
  #user;
  #transaction;

  constructor(user, url, trnsaction = '') {
    this.to = user.email;
    this.firstName = user.name.split(' ').at(0);
    this.from = `L2CL CDC Academy <${process.env.EMAIL_FROM}>`;
    this.url = url;
    this.#user = user;
    this.#transaction = trnsaction;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
     });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // render html for email
    const html = await ejs.renderFile(`${__dirname}/../views/email/${template}.ejs`, {
      firstName: this.firstName,
      url: this.url,
      subject: this.subject,
      user: this.#user,
      transaction: this.#transaction,
    });

    // define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // send actual email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to L2CL Family');
  }

  async sendPassordReset() {
    await this.send('passwordReset', 'Your Password reset token (valid for only 10 minutes)');
  }

  async sendFeeDeposit() {
    await this.send('feeDeposit', `#${this.#transaction.transactionId} Your fees has been successfully deposited.`);
  }
}
