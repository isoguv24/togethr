# 🔧 unmute Supabase Setup Guide

This guide will help you set up Supabase as the backend for your unmute mental health platform.

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- A [Supabase](https://supabase.com) account
- Basic knowledge of SQL and PostgreSQL

## 🚀 Step 1: Create a Supabase Project

1. **Sign up/Login** to [Supabase](https://supabase.com)
2. **Create a new project**:
   - Click "New Project"
   - Choose your organization
   - Enter project name: `unmute`
   - Generate a strong database password
   - Select a region close to your users
   - Click "Create new project"

3. **Wait for setup** (usually 2-3 minutes)

## 🗄️ Step 2: Set Up the Database Schema

1. **Navigate to SQL Editor** in your Supabase dashboard
2. **Create a new query** and paste the entire contents of `supabase-schema.sql`
3. **Run the query** to create all tables, functions, and policies
4. **Verify creation** in the Table Editor - you should see:
   - `users` table
   - `messages` table  
   - `badges` table
   - `moods` table

## 🔐 Step 3: Configure Authentication

1. **Go to Authentication > Settings**
2. **Enable Anonymous sign-ins**:
   - Scroll to "Anonymous sign-ins"
   - Toggle ON "Enable anonymous sign-ins"
   - Click "Save"

3. **Configure Site URL** (for production):
   - Set Site URL to your domain (e.g., `https://your-domain.com`)
   - Add redirect URLs if needed

## 🔑 Step 4: Get Your API Keys

1. **Go to Settings > API**
2. **Copy these values**:
   - Project URL
   - `anon` `public` key (this is safe for client-side use)
   - Service role key (keep this secret, for server-side only)

## 📝 Step 5: Configure Environment Variables

1. **Create `.env.local`** in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For server-side operations (keep secret)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

2. **Replace the placeholder values** with your actual Supabase credentials

## 🔄 Step 6: Enable Real-time Features

1. **Go to Database > Replication**
2. **Enable real-time** for these tables:
   - ✅ `messages` (for live chat)
   - ✅ `users` (for online status)
   - ✅ `badges` (for live badge notifications)

3. **Alternatively**, the schema already includes:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE badges;
```

## 🧪 Step 7: Test the Integration

1. **Install dependencies**:
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Test the flow**:
   - Visit `http://localhost:3000`
   - Complete the onboarding process
   - Check if user profile is created in Supabase
   - Try sending messages in community chat
   - Add a mood entry
   - Verify data appears in Supabase tables

## 🔍 Step 8: Monitor and Debug

### Using Supabase Dashboard

1. **Database > Table Editor**: View your data
2. **Authentication > Users**: See registered users  
3. **Logs**: Monitor real-time activity
4. **API Logs**: Debug query issues

### Browser Developer Tools

- Check Network tab for API calls
- Look for console errors
- Verify real-time subscriptions in Network > WS

### Common Issues

**Authentication fails:**
- Verify anonymous auth is enabled
- Check API keys in environment variables
- Ensure `.env.local` is in project root

**Real-time not working:**
- Confirm tables are added to replication
- Check real-time subscription status in logs
- Verify RLS policies allow reads

**Database queries fail:**
- Review RLS policies
- Check user permissions
- Verify function signatures

## 🚀 Step 9: Deploy to Production

### Vercel Deployment

1. **Push code to GitHub**
2. **Connect repository to Vercel**
3. **Add environment variables in Vercel dashboard**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Update Supabase Auth settings**:
   - Add your Vercel domain to Site URL
   - Add to redirect URLs if needed

### Environment-Specific Configuration

For different environments (development, staging, production), you can:

1. **Create separate Supabase projects**
2. **Use different environment variable files**
3. **Configure different authentication settings**

## 📊 Database Schema Overview

### Tables Created

- **`users`**: User profiles with gamification data
- **`messages`**: Chat messages with room-based organization  
- **`badges`**: Achievement system for user engagement
- **`moods`**: Daily mood tracking with analytics

### Security Features

- **Row Level Security (RLS)** on all tables
- **User isolation** - users can only access their own data
- **Public chat rooms** - messages are readable by all users
- **Anonymous authentication** - no email/password required

### Key Functions

- `award_user_xp()`: Handles XP and level calculations
- `get_mood_statistics()`: Computes mood trends and streaks
- Auto-updating `updated_at` timestamps

## 🛠️ Customization Options

### Adding New Mental Health Topics

Update the enum in your database:

```sql
ALTER TYPE mental_health_topic ADD VALUE 'new_topic_name';
```

### Creating Custom Badge Types

Insert into the badges system through your application logic or directly:

```sql
-- Example: Award a custom badge
INSERT INTO badges (user_id, badge_type, badge_name, badge_description, badge_icon, rarity)
VALUES ('user-uuid', 'milestone_30_days', '30 Day Streak', 'Used the app for 30 consecutive days', '🔥', 'epic');
```

### Extending Mood Tracking

Add new columns to the `moods` table:

```sql
ALTER TABLE moods ADD COLUMN sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10);
```

## 🔐 Security Best Practices

1. **Never expose service role key** in client-side code
2. **Use RLS policies** to restrict data access
3. **Validate user inputs** before database operations
4. **Monitor API usage** for abuse patterns
5. **Regular security audits** of your policies

## 📈 Performance Optimization

1. **Use indexes** on frequently queried columns (already included)
2. **Implement pagination** for large datasets
3. **Cache frequently accessed data**
4. **Monitor query performance** in Supabase dashboard
5. **Use connection pooling** for high-traffic applications

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Documentation](https://supabase.com/docs/guides/realtime)
- [Next.js Integration Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## 🆘 Need Help?

If you encounter issues:

1. Check the [Supabase Community](https://github.com/supabase/supabase/discussions)
2. Review your RLS policies and table structure
3. Verify environment variables are set correctly
4. Check browser console and Supabase logs for errors

---

**🎉 You're all set!** Your unmute app now has a fully functional Supabase backend with real-time chat, user authentication, gamification, and mood tracking. 

## 🛠️ Customization Options

### Adding New Mental Health Topics

Update the enum in your database:

```sql
ALTER TYPE mental_health_topic ADD VALUE 'new_topic_name';
```

### Creating Custom Badge Types

Insert into the badges system through your application logic or directly:

```sql
-- Example: Award a custom badge
INSERT INTO badges (user_id, badge_type, badge_name, badge_description, badge_icon, rarity)
VALUES ('user-uuid', 'milestone_30_days', '30 Day Streak', 'Used the app for 30 consecutive days', '🔥', 'epic');
```

### Extending Mood Tracking

Add new columns to the `moods` table:

```sql
ALTER TABLE moods ADD COLUMN sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10);
```

## 🔐 Security Best Practices

1. **Never expose service role key** in client-side code
2. **Use RLS policies** to restrict data access
3. **Validate user inputs** before database operations
4. **Monitor API usage** for abuse patterns
5. **Regular security audits** of your policies

## 📈 Performance Optimization

1. **Use indexes** on frequently queried columns (already included)
2. **Implement pagination** for large datasets
3. **Cache frequently accessed data**
4. **Monitor query performance** in Supabase dashboard
5. **Use connection pooling** for high-traffic applications

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Documentation](https://supabase.com/docs/guides/realtime)
- [Next.js Integration Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## 🆘 Need Help?

If you encounter issues:

1. Check the [Supabase Community](https://github.com/supabase/supabase/discussions)
2. Review your RLS policies and table structure
3. Verify environment variables are set correctly
4. Check browser console and Supabase logs for errors

---

**🎉 You're all set!** Your unmute app now has a fully functional Supabase backend with real-time chat, user authentication, gamification, and mood tracking. 