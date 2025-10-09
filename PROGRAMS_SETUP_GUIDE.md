# Programs Management Setup Guide

This guide will help you set up the Programs Management feature in your admin dashboard with real Supabase data.

## Quick Setup (Recommended)

### Option 1: Automatic Setup via UI

1. **Go to Admin Dashboard**
   - Navigate to `/admin` in your application
   - Click on the "Programs" tab

2. **Click Setup Button**
   - If the programs table doesn't exist, you'll see a "Setup Programs Table" button
   - Click it to automatically create the table with the Tension Release Program

3. **Done!**
   - The table will be created with the Tension Release Program (18 modules)
   - You can now view client progress and enrollments
   - Add more programs as needed

### Option 2: API Endpoint

You can also set up the table programmatically:

```bash
curl -X POST http://localhost:3000/api/setup-programs-table
```

## Manual Setup (Alternative)

If automatic setup doesn't work (e.g., due to RPC permissions), you can run the SQL migration manually:

### Steps:

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor

2. **Run the Migration**
   - Open the file `supabase-migrations/create-programs-table.sql`
   - Copy all the SQL code
   - Paste it into the Supabase SQL Editor
   - Click "Run"

3. **Verify**
   - Go to the Table Editor in Supabase
   - You should see a new table called `programs`
   - It should have the Tension Release Program (18 modules)

## Database Schema

The `programs` table has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | TEXT | Program name (required) |
| `description` | TEXT | Program description |
| `price` | DECIMAL | Price in USD |
| `duration` | TEXT | Duration (e.g., "8 weeks") |
| `category` | TEXT | Category (e.g., "Strength Training") |
| `level` | TEXT | Difficulty level (beginner/intermediate/advanced) |
| `is_active` | BOOLEAN | Whether program is active |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Initial Program

The setup includes this real program with existing clients:

**Tension Release Program** - $297
- 18 modules, Recovery category, Beginner level
- Premium program with 18 video modules for tension release and performance enhancement
- Complete body tension release system covering glutes, back, hips, legs, and recovery techniques
- Real program with active clients tracking their progress through the modules

## Features

### Admin Dashboard Features:

- ✅ **View all programs** with enrollment counts and revenue
- ✅ **Add new programs** with custom details
- ✅ **Edit existing programs** (name, description, price, etc.)
- ✅ **Delete programs** (with confirmation)
- ✅ **Search programs** by name, description, or category
- ✅ **Filter by status** (active/inactive)
- ✅ **View statistics**:
  - Total programs count
  - Active programs count
  - Total enrollments
  - Total revenue

### Security (Row Level Security):

- ✅ Admins can view, create, update, and delete programs
- ✅ Authenticated users can view active programs only
- ✅ All operations are logged with timestamps

## Troubleshooting

### Issue: Setup button doesn't work

**Solution**: Run the SQL migration manually (see Manual Setup above)

### Issue: "Permission denied" error

**Solution**: Make sure you're logged in as an admin user. Check that your user profile has `role = 'admin'` in the `user_profiles` table.

### Issue: Programs not showing

**Solution**: 
1. Check the browser console for errors
2. Verify the table exists in Supabase
3. Check RLS policies are enabled
4. Try refreshing the page

### Issue: Can't create/edit programs

**Solution**:
1. Verify you're logged in as admin
2. Check the Network tab for API errors
3. Verify the `programs` table exists in Supabase

## Next Steps

After setup, you can:

1. **View the Tension Release Program** with enrollment counts and client progress
2. **Track client progress** through the 18 modules (linked to `user_programs` table)
3. **Add more programs** using the "Add Program" button
4. **Set programs as active/inactive** based on availability
5. **Monitor revenue** from program sales
6. **See which clients** are enrolled and their advancement through the program

## API Endpoints

The following API endpoints are available:

- `GET /api/admin/programs` - Fetch all programs
- `POST /api/admin/programs` - Create a new program
- `PUT /api/admin/programs` - Update a program
- `DELETE /api/admin/programs` - Delete a program
- `POST /api/setup-programs-table` - Setup the programs table
- `GET /api/setup-programs-table` - Check if table exists

## Support

If you encounter issues:

1. Check this guide first
2. Review the console logs
3. Verify your Supabase connection
4. Ensure your user has admin role

---

**Note**: The programs table is separate from `user_programs` which tracks which users are enrolled in which programs.

