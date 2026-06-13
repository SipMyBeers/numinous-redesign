import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    const { name, email, projectType, budget, timeline, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // If RESEND_API_KEY is not set, log and return success (dev mode)
    if (!process.env.RESEND_API_KEY) {
      console.log("[DEV] Contact form submission (no RESEND_API_KEY):", body);
      return NextResponse.json({
        success: true,
        message: "Message received (dev mode — email not sent).",
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b35; border-bottom: 1px solid #333; padding-bottom: 12px;">
          New Project Inquiry
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 12px; color: #888; width: 140px;">Name</td>
            <td style="padding: 8px 12px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #888;">Email</td>
            <td style="padding: 8px 12px;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${body.phone ? `<tr><td style="padding: 8px 12px; color: #888;">Phone</td><td style="padding: 8px 12px;">${body.phone}</td></tr>` : ""}
          <tr>
            <td style="padding: 8px 12px; color: #888;">Project Type</td>
            <td style="padding: 8px 12px;">${projectType}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #888;">Budget</td>
            <td style="padding: 8px 12px;">${budget}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #888;">Timeline</td>
            <td style="padding: 8px 12px;">${timeline}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
          <p style="color: #888; margin: 0 0 8px;">Message</p>
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: "Numinous Designs <onboarding@resend.dev>",
      to: "ell@numinousdesigns.com",
      replyTo: email,
      subject: `New Inquiry: ${projectType} — ${name}`,
      html: htmlBody,
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent. We'll be in touch soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
