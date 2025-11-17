# Department Defaults Setup

## ✅ Configuration Complete!

Each worktree now has its own default department that will automatically load when you start the dev server.

## How It Works

The `src/App.tsx` file has been updated to read from environment variables:
- `NEXT_PUBLIC_DEFAULT_CATEGORY` - Sets which department/category to show
- `NEXT_PUBLIC_DEFAULT_TEAM` - Sets which team to select

Each worktree has its own `.env.local` file with different defaults.

## Default Settings by Worktree

### Window 1 - Administration (Port 3000)
- **Location**: `C:\Users\conta\ERP\administration\.env.local`
- **Default Category**: `Administration`
- **Default Team**: `Administration Team`
- **URL**: http://localhost:3000

### Window 2 - Marketing (Port 3001)
- **Location**: `C:\Users\conta\ERP\marketing\.env.local`
- **Default Category**: `Marketing`
- **Default Team**: `Marketing`
- **URL**: http://localhost:3001

### Window 3 - CRM (Port 3002)
- **Location**: `C:\Users\conta\ERP\crm\.env.local`
- **Default Category**: `CRM`
- **Default Team**: `Sale Team`
- **URL**: http://localhost:3002

### Window 4 - Products (Port 3003)
- **Location**: `C:\Users\conta\ERP\products\.env.local`
- **Default Category**: `Products`
- **Default Team**: `Sale Team`
- **URL**: http://localhost:3003

## What This Means

When you:
1. Open each Cursor window with its worktree folder
2. Run `npm run dev:admin` (or the appropriate script)
3. Open the browser

**Each window will automatically show its designated department!**

- Window 1 → Opens directly to Administration
- Window 2 → Opens directly to Marketing
- Window 3 → Opens directly to CRM
- Window 4 → Opens directly to Products

## Customization

You can edit any `.env.local` file to change the defaults for that specific worktree. The changes will only affect that one window/worktree.

### Available Categories
- `Marketing`
- `CRM`
- `Products`
- `Orders`
- `Fulfilment`
- `Logistics`
- `Reports`
- `Workspace`
- `Administration`
- `Home`

### Available Teams
- `Master Admin`
- `Marketing`
- `Sale Team`
- `Operation Team`
- `Administration Team`
- `Accounting`

## Important Notes

- ✅ Each worktree is **completely independent**
- ✅ Changes in one `.env.local` **do not affect** the others
- ✅ You can still navigate to other departments in each window
- ✅ The defaults only affect the **initial load** when the app starts
- ✅ `.env.local` files are in `.gitignore`, so they won't be committed

## Next Steps

1. **Merge master into each branch** (if you haven't already):
   ```bash
   cd C:\Users\conta\ERP\administration
   git merge master
   # Repeat for marketing, crm, products
   ```

2. **Install dependencies** in each worktree:
   ```bash
   cd C:\Users\conta\ERP\administration
   npm install
   # Repeat for marketing, crm, products
   ```

3. **Start the dev servers**:
   - Window 1: `npm run dev:admin`
   - Window 2: `npm run dev:marketing`
   - Window 3: `npm run dev:crm`
   - Window 4: `npm run dev:products`

4. **Open each URL** and see the department-specific defaults!

## Troubleshooting

If the defaults aren't working:
1. Make sure you've restarted the dev server after creating `.env.local`
2. Check that the `.env.local` file exists in the correct worktree directory
3. Verify the environment variable names are correct (must start with `NEXT_PUBLIC_`)
4. Clear browser cache if needed

