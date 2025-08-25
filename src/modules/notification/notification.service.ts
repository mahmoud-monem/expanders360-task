import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";

import { appConfig } from "src/common/config/app.config";

import { Match } from "../match/entities/match.entity";
import { Vendor } from "../vendor/entities/vendor.entity";

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.setupEmailTransporter();
  }

  private setupEmailTransporter() {
    const smtpHost = appConfig.SMTP_HOST;
    const smtpPort = parseInt(appConfig.SMTP_PORT, 10);
    const smtpUser = appConfig.SMTP_USER;
    const smtpPass = appConfig.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      this.logger.warn("SMTP configuration incomplete. Email notifications will be mocked.");
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: "unix",
        buffer: true,
      });
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  async sendNewMatchNotification(match: Match): Promise<void> {
    try {
      const { project } = match;

      if (!project?.client?.email) {
        this.logger.warn(`No contact email found for project ${project?.id}`);
        return;
      }

      const subject = `New Vendor Match Found for Your Project`;
      const html = this.generateMatchNotificationHtml(match);

      const mailOptions = {
        from: process.env.SMTP_USER || "noreply@expanders360.com",
        to: project.client.email,
        subject,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Match notification sent to ${project.client.email} for project ${project.id}`);

      if (result.message) {
        this.logger.debug(`Mock email content: ${result.message.toString()}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send match notification: ${error.message}`, error.stack);
    }
  }

  async sendSlaViolationNotification(vendor: Vendor): Promise<void> {
    try {
      const subject = `SLA Violation Alert - Vendor ${vendor.name}`;
      const html = this.generateSlaViolationHtml(vendor);

      const mailOptions = {
        from: process.env.SMTP_USER || "noreply@expanders360.com",
        to: process.env.ADMIN_EMAIL || "admin@expanders360.com",
        subject,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`SLA violation notification sent for vendor ${vendor.name}`);

      if (result.message) {
        this.logger.debug(`Mock email content: ${result.message.toString()}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send SLA violation notification: ${error.message}`, error.stack);
    }
  }

  private generateMatchNotificationHtml(match: Match): string {
    const { project, vendor, score } = match;

    return `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">New Vendor Match Found!</h2>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #27ae60; margin-top: 0;">Match Details</h3>
            <p><strong>Project:</strong> ${project?.id} - ${project?.country?.name}</p>
            <p><strong>Vendor:</strong> ${vendor?.name}</p>
            <p><strong>Match Score:</strong> ${score}/10</p>
            <p><strong>Vendor Rating:</strong> ${vendor?.rating}/5</p>
            <p><strong>Response SLA:</strong> ${vendor?.responseSlaHours} hours</p>
          </div>

          <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1976d2; margin-top: 0;">Services Offered:</h4>
            <ul>
              ${vendor?.offeredServices?.map((service: string) => `<li>${service.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}</li>`).join("") || "<li>No services listed</li>"}
            </ul>
          </div>

          <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #f57c00; margin-top: 0;">Countries Supported:</h4>
            <p>${vendor?.supportedCountries?.map(c => c.name).join(", ") || "No countries listed"}</p>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This is an automated notification from Expanders360. Please do not reply to this email.
          </p>
        </body>
      </html>
    `;
  }

  private generateSlaViolationHtml(vendor: Vendor): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">SLA Violation Alert</h2>

          <div style="background-color: #fdedec; padding: 20px; border-radius: 8px; border-left: 4px solid #e74c3c;">
            <h3 style="color: #e74c3c; margin-top: 0;">Vendor SLA Expired</h3>
            <p><strong>Vendor:</strong> ${vendor.name}</p>
            <p><strong>SLA Hours:</strong> ${vendor.responseSlaHours}</p>
            <p><strong>Rating:</strong> ${vendor.rating}/5</p>
          </div>

          <p style="margin-top: 20px;">
            Please review this vendor's performance and consider updating their SLA or taking appropriate action.
          </p>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This is an automated alert from Expanders360 system.
          </p>
        </body>
      </html>
    `;
  }
}
