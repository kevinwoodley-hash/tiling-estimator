# FreeAgent Integration Setup Guide

## Overview

The Tiling Estimator integrates directly with FreeAgent accounting software, allowing you to export quotes as invoices with a single click. This eliminates manual data entry and ensures accurate financial records.

## Prerequisites

- Active FreeAgent account (Standard, Plus, or Premium plan)
- Access to FreeAgent Developer API settings
- Customer email addresses for proper contact linking

---

## Step 1: Access FreeAgent Developer Settings

1. Log in to your FreeAgent account at [https://www.freeagent.com](https://www.freeagent.com)
2. Click on your **profile icon** (top right)
3. Select **"Settings"**
4. Navigate to **"Developer API"** in the left sidebar

---

## Step 2: Create an API Application

### If you don't have an app yet:

1. Click **"Create a new app"**
2. Fill in the application details:
   - **App Name**: `Tiling Estimator` (or your preferred name)
   - **Description**: `Integration for tiling quotes and estimates`
   - **OAuth Redirect URI**: Leave blank (not needed for Personal Access Tokens)
3. Click **"Create Application"**

### If you already have an app:

1. Select your existing app from the list
2. Continue to the next step

---

## Step 3: Generate Personal Access Token

1. In your app settings, find the **"Personal Access Tokens"** section
2. Click **"Generate new token"**
3. Give your token a name: `Tiling Estimator Token`
4. Set appropriate permissions:
   - ✅ **Contacts** (Read & Write)
   - ✅ **Invoices** (Read & Write)
   - ✅ **Projects** (Read)
5. Click **"Generate token"**
6. **⚠️ IMPORTANT**: Copy the token immediately - it won't be shown again!

The token will look something like:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4: Configure Tiling Estimator

1. Open the **Tiling Estimator** app
2. Enable **"Professional Mode"**
3. Scroll to **"FreeAgent Integration"** section
4. Paste your Personal Access Token into the field
5. The app will show **"✓ Connected"** when configured correctly

---

## Step 5: Test Your Integration

1. Create a test quote with:
   - Customer name and email
   - At least one room with dimensions
   - Some pricing information
2. Enable Professional Mode
3. Fill in customer details
4. Click **"FreeAgent"** export button
5. Check your FreeAgent account for the new invoice

---

## What Gets Exported

When you export a quote to FreeAgent, the following data is sent:

### Invoice Details
- **Date**: Current date
- **Reference**: `Tiling-[timestamp]`
- **Payment Terms**: 30 days (default)
- **Comments**: Project summary with room count and total area

### Line Items Include
- 📅 Day rate (if set)
- 👷 Labour costs (per m²)
- 🧱 Adhesive
- 🔲 Grout
- 🖌️ Primer
- 🛡️ Sealer
- 🔧 Cement board (if selected)
- 📏 Ditra mat (if selected)
- 💧 Floor tanking (if selected)
- 💧 Wall tanking (if selected)
- ✂️ Tile trim (if selected)
- 🖌️ Wall primer (if selected)
- 💰 Markup (as separate line item)

### Automatic Calculations
- ✅ Quantities calculated automatically
- ✅ Unit prices from your pricing settings
- ✅ VAT applied based on your settings
- ✅ Total calculated with markup

---

## Troubleshooting

### Error: "Failed to export to FreeAgent"

**Possible causes:**
1. **Invalid token**: Generate a new token
2. **Token expired**: Tokens don't expire, but check if token was revoked
3. **Missing permissions**: Ensure token has Invoice & Contact permissions
4. **Customer not found**: FreeAgent requires existing contact - create customer in FreeAgent first

**Solution:**
- Verify token is copied correctly (no extra spaces)
- Check token permissions in FreeAgent
- Ensure customer email exists in FreeAgent contacts

### Error: "Please enter customer email"

**Cause**: FreeAgent requires customer email to link contacts

**Solution:**
- Fill in customer email before exporting
- Ensure email matches existing FreeAgent contact

### Connection Shows "Not Connected"

**Cause**: Token not entered or invalid

**Solution:**
- Paste token into access token field
- Remove any spaces before/after token
- Generate new token if current one doesn't work

---

## Best Practices

### 1. Customer Management
- Create customers in FreeAgent first
- Use same email addresses in both systems
- Keep contact information synchronized

### 2. Pricing Consistency
- Set standard rates in the app
- Use same VAT rate as your FreeAgent settings
- Review markup percentages regularly

### 3. Security
- ✅ Store token securely (local to your browser)
- ✅ Don't share token with anyone
- ✅ Revoke old tokens if regenerating
- ❌ Never commit token to code repositories
- ❌ Don't share screenshots containing token

### 4. Workflow
1. Create quote in Tiling Estimator
2. Review all details and pricing
3. Export to FreeAgent
4. Review invoice in FreeAgent
5. Send invoice to customer from FreeAgent

---

## Benefits of Integration

✅ **Time Saving**: Create invoices in seconds, not minutes
✅ **Accuracy**: Eliminate manual data entry errors
✅ **Professional**: Quotes become invoices instantly
✅ **VAT Compliance**: Automatic VAT calculation
✅ **Record Keeping**: All quotes tracked in FreeAgent
✅ **Payment Tracking**: Use FreeAgent's payment tools

---

## Privacy & Security

### Data Transmission
- Token stored locally in your browser
- Data sent directly to FreeAgent API
- No third-party servers involved
- HTTPS encrypted communication

### What's Shared
- Quote details (rooms, materials, pricing)
- Customer information (name, email)
- Your business information (if configured)

### What's NOT Shared
- Your FreeAgent password
- Other FreeAgent data
- Personal information beyond the quote

---

## Support

### FreeAgent Support
- Documentation: [https://dev.freeagent.com](https://dev.freeagent.com)
- Support: [https://support.freeagent.com](https://support.freeagent.com)

### Common Questions

**Q: Will this work with FreeAgent Lite?**
A: API access requires Standard, Plus, or Premium plans.

**Q: Can I export multiple quotes at once?**
A: Each quote must be exported individually.

**Q: Will exported quotes appear as Draft or Final?**
A: Quotes are created as Draft invoices in FreeAgent.

**Q: Can I edit the invoice after export?**
A: Yes, edit directly in FreeAgent after export.

**Q: Does this work offline?**
A: No, internet connection required for FreeAgent API.

---

## Version History

**v1.0** - Initial FreeAgent integration
- Personal Access Token authentication
- Invoice creation with line items
- VAT support
- Customer linking
- Material calculations

---

## Next Steps

Once configured, you can:
1. 📋 Create quotes in the app
2. 🚀 Export to FreeAgent instantly
3. 📧 Send invoices to customers
4. 💰 Track payments in FreeAgent
5. 📊 Generate financial reports

**Your accounting workflow just got faster!** ⚡
