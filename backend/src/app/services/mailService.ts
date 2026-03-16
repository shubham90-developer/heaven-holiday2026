import nodemailer from 'nodemailer'

export interface MailOptions {
  to: string
  subject: string
  html: string
}

export const getTransporter = () => {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration missing. Please set SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_PORT')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function sendMail({ to, subject, html }: MailOptions) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com'
  const transporter = getTransporter()
  const info = await transporter.sendMail({ from, to, subject, html })
  return info
}

// Generate invoice email HTML
export function generateInvoiceEmail(order: any): string {
  const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const itemsHtml = order.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center;">
          <img src="${item.thumbnail || ''}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 12px;" />
          <div>
            <div style="font-weight: 500; color: #111827;">${item.name}</div>
            ${item.selectedColor ? `<div style="font-size: 12px; color: #6b7280;">Color: ${item.selectedColor}</div>` : ''}
            ${item.selectedSize ? `<div style="font-size: 12px; color: #6b7280;">Size: ${item.selectedSize}</div>` : ''}
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹ ${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">₹ ${item.subtotal.toFixed(2)}</td>
    </tr>
  `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Invoice</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 650px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Order Invoice</h1>
          <p style="color: #e0e7ff; margin: 8px 0 0 0; font-size: 14px;">Thank you for your order!</p>
        </div>

        <!-- Order Info -->
        <div style="padding: 30px;">
          <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <p style="margin: 0; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</p>
                <p style="margin: 4px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">${order.orderNumber}</p>
              </div>
              <div>
                <p style="margin: 0; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Order Date</p>
                <p style="margin: 4px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">${orderDate}</p>
              </div>
              <div>
                <p style="margin: 0; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Payment Method</p>
                <p style="margin: 4px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">${order.paymentInfo.method.replace(/_/g, ' ').toUpperCase()}</p>
              </div>
              <div>
                <p style="margin: 0; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Status</p>
                <p style="margin: 4px 0 0 0; color: #10b981; font-size: 16px; font-weight: 600; text-transform: capitalize;">${order.status}</p>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div style="margin-bottom: 24px;">
            <h2 style="color: #111827; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">Shipping Address</h2>
            <div style="background-color: #f9fafb; border-radius: 6px; padding: 16px;">
              <p style="margin: 0; color: #111827; font-weight: 500;">${order.shippingAddress.fullName}</p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">${order.shippingAddress.addressLine1}</p>
              ${order.shippingAddress.addressLine2 ? `<p style="margin: 4px 0; color: #6b7280; font-size: 14px;">${order.shippingAddress.addressLine2}</p>` : ''}
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">${order.shippingAddress.country}</p>
              <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">📧 ${order.shippingAddress.email}</p>
              <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">📞 ${order.shippingAddress.phone}</p>
            </div>
          </div>

          <!-- Order Items -->
          <h2 style="color: #111827; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background-color: #ffffff; border-radius: 6px; overflow: hidden;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 12px; text-align: left; font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                <th style="padding: 12px; text-align: center; font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                <th style="padding: 12px; text-align: right; font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                <th style="padding: 12px; text-align: right; font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Order Summary -->
          <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px; margin-top: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 15px;">Subtotal</span>
              <span style="color: #111827; font-size: 15px; font-weight: 500;">₹ ${order.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 15px;">Shipping</span>
              <span style="color: #111827; font-size: 15px; font-weight: 500;">₹ ${order.shippingCost.toFixed(2)}</span>
            </div>
            ${
              order.discount > 0
                ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #10b981; font-size: 15px;">Discount</span>
              <span style="color: #10b981; font-size: 15px; font-weight: 500;">-₹ ${order.discount.toFixed(2)}</span>
            </div>
            `
                : ''
            }
            ${
              order.tax > 0
                ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 15px;">Tax</span>
              <span style="color: #111827; font-size: 15px; font-weight: 500;">₹ ${order.tax.toFixed(2)}</span>
            </div>
            `
                : ''
            }
            <div style="border-top: 2px solid #e5e7eb; margin: 16px 0; padding-top: 16px; display: flex; justify-content: space-between;">
              <span style="color: #111827; font-size: 18px; font-weight: 700;">Total</span>
              <span style="color: #667eea; font-size: 20px; font-weight: 700;">₹ ${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          ${order.notes ? `
          <div style="margin-top: 24px; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>Note:</strong> ${order.notes}</p>
          </div>
          ` : ''}
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">If you have any questions about your order, please contact us.</p>
          <p style="margin: 0; color: #9ca3af; font-size: 13px;">© ${new Date().getFullYear()} BigSell. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Send order invoice email
export async function sendOrderInvoice(order: any, recipientEmail: string) {
  const subject = `Order Invoice - ${order.orderNumber}`
  const html = generateInvoiceEmail(order)
  return sendMail({ to: recipientEmail, subject, html })
}
