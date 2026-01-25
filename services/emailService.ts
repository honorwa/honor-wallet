import { SupportTicket } from "../types";

// In production, replace these with actual keys from EmailJS
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'mock_service_id';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'mock_template_id';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'mock_public_key';

// Define the email payload structure
interface EmailPayload {
  to_email: string;
  subject: string;
  message: string;
  ticket_id: string;
  type: 'new_ticket' | 'admin_reply';
}

export const emailService = {
  /**
   * Send a notification when a new ticket is created
   */
  async sendNewTicketNotification(ticket: SupportTicket) {
    const payload: EmailPayload = {
      to_email: 'info@honor-wallet.com',
      subject: `New Support Ticket: ${ticket.subject}`,
      message: `
        New ticket received from: ${ticket.user_email}
        Ticket ID: ${ticket.id}
        Priority: ${ticket.priority}
        
        Message:
        ${ticket.message}
      `,
      ticket_id: ticket.id,
      type: 'new_ticket'
    };

    return this.sendEmail(payload);
  },

  /**
   * Send a notification when admin replies to a ticket
   */
  async sendAdminReplyNotification(ticket: SupportTicket, reply: string) {
    const payload: EmailPayload = {
      to_email: ticket.user_email,
      subject: `Re: ${ticket.subject} - Honor Wallet Support`,
      message: `
        Dear Member,
        
        You have received a reply to your support ticket regarding "${ticket.subject}".
        
        Admin Response:
        ${reply}
        
        Ticket ID: ${ticket.id}
        
        Sincerely,
        Honor Wallet Concierge
      `,
      ticket_id: ticket.id,
      type: 'admin_reply'
    };

    return this.sendEmail(payload);
  },

  /**
   * Internal method to send email via EmailJS or mock
   */
  async sendEmail(payload: EmailPayload) {
    console.log(`[EmailService] Sending email type: ${payload.type}`);
    console.log(`To: ${payload.to_email}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`Body: ${payload.message}`);

    // Check if we have real keys to try sending
    if (import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
        try {
            // Setup for real EmailJS call would go here
            // const emailjs = await import('@emailjs/browser');
            // await emailjs.send(SERVICE_ID, TEMPLATE_ID, payload, PUBLIC_KEY);
            console.log("Email sent via EmailJS (Simulated)");
            return true;
        } catch (error) {
            console.error("Failed to send email", error);
            return false;
        }
    } else {
        // Mock success
        return Promise.resolve(true);
    }
  }
};
