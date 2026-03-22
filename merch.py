#!/usr/bin/env python3
"""
MerchPoint Email Notification Service
Runs continuously and monitors Firebase Realtime Database for:
1. New orders → emails admin
2. Order status changes to 'approved' → emails the customer
3. New admin chat messages → emails the customer

Requirements: pip install firebase-admin
"""

import time
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from urllib.request import urlopen, Request

# ─── CONFIG ────────────────────────────────────────────────────
FIREBASE_DB_URL = "https://cscproject-8c451-default-rtdb.firebaseio.com"
ADMIN_EMAIL = "etherxchange6@gmail.com"
EMAIL_SENDER = "shoppifyinc@gmail.com"
EMAIL_PASSWORD = "eric gsqh eoph ylkp"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
POLL_INTERVAL = 15  # seconds
# ───────────────────────────────────────────────────────────────

# Track what we've already notified about
notified_orders = set()
notified_approvals = set()
notified_messages = {}  # {chatId: last_notified_timestamp}


def firebase_get(path: str):
    """Read data from Firebase REST API."""
    url = f"{FIREBASE_DB_URL}/{path}.json"
    try:
        req = Request(url, method="GET")
        with urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"[Firebase] Error reading {path}: {e}")
        return None


def send_email(to: str, subject: str, body_html: str):
    """Send an HTML email via SMTP."""
    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = f"MerchPoint <{EMAIL_SENDER}>"
        msg["To"] = to
        msg["Subject"] = subject
        msg.attach(MIMEText(body_html, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, to, msg.as_string())
        print(f"[Email] Sent to {to}: {subject}")
    except Exception as e:
        print(f"[Email] Failed to send to {to}: {e}")


def check_new_orders():
    """Notify admin when someone places a new order."""
    orders = firebase_get("merchpoint_orders")
    if not orders:
        return
    for order_id, order in orders.items():
        if order_id in notified_orders:
            continue
        notified_orders.add(order_id)
        items_text = ""
        for item in (order.get("items") or []):
            items_text += f"<li>{item.get('name', '?')} × {item.get('quantity', 1)} — ₦{item.get('price', 0):,.0f}</li>"

        html = f"""
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <h2 style="color: #0A1F44;">🛒 New Order Received</h2>
            <p><strong>Order ID:</strong> {order_id}</p>
            <p><strong>Customer:</strong> {order.get('customerName', 'N/A')}</p>
            <p><strong>Phone:</strong> {order.get('phone', 'N/A')}</p>
            <p><strong>Email:</strong> {order.get('email', 'N/A')}</p>
            <p><strong>Address:</strong> {order.get('address', '')}, {order.get('city', '')}, {order.get('state', '')}</p>
            <p><strong>Items:</strong></p>
            <ul>{items_text}</ul>
            <p style="font-size: 18px; color: #C9A84C;"><strong>Total: ₦{order.get('total', 0):,.0f}</strong></p>
            <p><strong>Status:</strong> {order.get('status', 'pending')}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px;">MerchPoint Notification Service</p>
        </div>
        """
        send_email(ADMIN_EMAIL, f"New Order: {order_id}", html)


def check_approved_orders():
    """Notify customers when their order is approved."""
    orders = firebase_get("merchpoint_orders")
    if not orders:
        return
    for order_id, order in orders.items():
        if order.get("status") != "approved":
            continue
        if order_id in notified_approvals:
            continue
        email = order.get("email", "")
        if not email:
            notified_approvals.add(order_id)
            continue
        notified_approvals.add(order_id)

        html = f"""
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <h2 style="color: #0A1F44;">✅ Your Order Has Been Approved!</h2>
            <p>Hi {order.get('customerName', 'Customer')},</p>
            <p>Great news! Your payment for order <strong>{order_id}</strong> has been confirmed and your order is now being processed.</p>
            <p>Delivery will begin shortly to your address:</p>
            <p style="background: #f8f8f8; padding: 12px; border-radius: 8px;">
                {order.get('address', '')}, {order.get('city', '')}, {order.get('state', '')} {order.get('postalCode', '')}
            </p>
            <p style="font-size: 18px; color: #C9A84C;"><strong>Total: ₦{order.get('total', 0):,.0f}</strong></p>
            <p>You can track your order anytime using your Order ID.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px;">MerchPoint — Your One-Stop Shop for Affordable POS Machines</p>
        </div>
        """
        send_email(email, f"Order Approved: {order_id}", html)


def check_new_admin_messages():
    """Notify users when admin sends them a new chat message."""
    chats = firebase_get("merchpoint_chats")
    if not chats:
        return
    for user_id, chat_data in chats.items():
        messages = chat_data.get("messages")
        if not messages:
            continue

        # Find the latest admin message
        latest_admin_ts = 0
        latest_admin_text = ""
        for msg_id, msg in messages.items():
            if msg.get("sender") == "admin" and msg.get("timestamp", 0) > latest_admin_ts:
                latest_admin_ts = msg["timestamp"]
                latest_admin_text = msg.get("text", "📷 Image")

        if latest_admin_ts == 0:
            continue

        prev_ts = notified_messages.get(user_id, 0)
        if latest_admin_ts <= prev_ts:
            continue
        notified_messages[user_id] = latest_admin_ts

        # Skip initial load — only notify after first full scan
        if prev_ts == 0:
            continue

        # Try to find user email from merchpoint_users
        user_data = firebase_get(f"merchpoint_users/{user_id}")
        email = ""
        name = "Customer"
        if user_data:
            email = user_data.get("email", "")
            name = user_data.get("name", "Customer")
        if not email:
            continue

        html = f"""
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <h2 style="color: #0A1F44;">💬 New Message from MerchPoint</h2>
            <p>Hi {name},</p>
            <p>You have a new message from MerchPoint support:</p>
            <div style="background: #f8f8f8; padding: 16px; border-radius: 8px; border-left: 4px solid #C9A84C;">
                <p style="margin: 0;">{latest_admin_text}</p>
            </div>
            <p style="margin-top: 16px;">Open the MerchPoint app to reply.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px;">MerchPoint — Your One-Stop Shop for Affordable POS Machines</p>
        </div>
        """
        send_email(email, "New message from MerchPoint Support", html)


def main():
    print("=" * 50)
    print("  MerchPoint Notification Service Started")
    print(f"  Admin Email: {ADMIN_EMAIL}")
    print(f"  Polling every {POLL_INTERVAL}s")
    print("=" * 50)

    # Initial load to populate tracking sets (don't send for existing data)
    print("[Init] Loading existing data...")
    orders = firebase_get("merchpoint_orders")
    if orders:
        for oid, o in orders.items():
            notified_orders.add(oid)
            if o.get("status") == "approved":
                notified_approvals.add(oid)
    chats = firebase_get("merchpoint_chats")
    if chats:
        for uid, cd in chats.items():
            msgs = cd.get("messages", {})
            latest = 0
            for mid, m in msgs.items():
                if m.get("sender") == "admin" and m.get("timestamp", 0) > latest:
                    latest = m["timestamp"]
            if latest:
                notified_messages[uid] = latest
    print(f"[Init] Tracking {len(notified_orders)} orders, {len(notified_approvals)} approvals, {len(notified_messages)} chats")
    print("[Running] Listening for changes...\n")

    while True:
        try:
            check_new_orders()
            check_approved_orders()
            check_new_admin_messages()
        except Exception as e:
            print(f"[Error] {e}")
        time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    main()
