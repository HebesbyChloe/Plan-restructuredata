# Quick Start Guide - 4 Parallel Development Servers

## Setup Complete! ✅

Your 4 Git worktrees have been created and are ready to use.

## Directory Structure

```
C:\Users\conta\ERP\
├── FIRST CURRENT AI Orchestra ERP Design\  (main/master branch)
├── administration\  (feature/administration - Port 3000)
├── marketing\       (feature/marketing - Port 3001)
├── crm\             (feature/crm - Port 3002)
└── products\        (feature/products - Port 3003)
```

## Quick Start (3 Steps)

### Step 1: Install Dependencies (First Time Only)

Run this once to install npm packages in all worktrees:

```bash
install-all-dependencies.bat
```

Or manually:
```bash
cd ..\administration && npm install
cd ..\marketing && npm install
cd ..\crm && npm install
cd ..\products && npm install
```

### Step 2: Start All Servers

**Option A: Start All at Once (Recommended)**
```bash
start-all-dev-servers.bat
```

This opens 4 separate terminal windows, one for each server.

**Option B: Start Individually**

Open 4 separate terminals:

**Terminal 1 - Administration:**
```bash
cd ..\administration
npm run dev:admin
```

**Terminal 2 - Marketing:**
```bash
cd ..\marketing
npm run dev:marketing
```

**Terminal 3 - CRM:**
```bash
cd ..\crm
npm run dev:crm
```

**Terminal 4 - Products:**
```bash
cd ..\products
npm run dev:products
```

### Step 3: Access Your Applications

- **Administration**: http://localhost:3000
- **Marketing**: http://localhost:3001
- **CRM**: http://localhost:3002
- **Products**: http://localhost:3003

## Available Scripts

### Helper Scripts

- `start-all-dev-servers.bat` - Start all 4 servers in separate windows
- `install-all-dependencies.bat` - Install npm packages in all worktrees
- `setup-worktrees.bat` - Re-run setup if needed

### NPM Scripts (in each worktree)

- `npm run dev:admin` - Start Administration server (Port 3000)
- `npm run dev:marketing` - Start Marketing server (Port 3001)
- `npm run dev:crm` - Start CRM server (Port 3002)
- `npm run dev:products` - Start Products server (Port 3003)

## Working with Branches

### Making Changes

1. Navigate to the appropriate worktree directory
2. Make your changes
3. Commit as normal: `git add . && git commit -m "Your message"`
4. Push when ready: `git push origin feature/administration`

### Each Worktree is Independent

- `administration/` is always on `feature/administration`
- `marketing/` is always on `feature/marketing`
- `crm/` is always on `feature/crm`
- `products/` is always on `feature/products`

You don't need to switch branches - each directory is already on its branch!

## Environment Variables

Each worktree can have its own `.env.local` file:

- `administration/.env.local`
- `marketing/.env.local`
- `crm/.env.local`
- `products/.env.local`

Or copy the same `.env.local` to all worktrees if they share the same Supabase credentials.

## Troubleshooting

### Port Already in Use

If you see "Port 3000 is already in use":
1. Find the process: `netstat -ano | findstr :3000`
2. Kill it: `taskkill /PID <pid> /F`
3. Or change the port in `package.json`

### Worktree Issues

To remove and recreate a worktree:
```bash
git worktree remove ..\administration
git worktree add ..\administration feature/administration
```

### Dependencies Not Installed

If you see module errors, run:
```bash
install-all-dependencies.bat
```

## Merging Work Back

When ready to combine all branches:

```bash
cd "FIRST CURRENT AI Orchestra ERP Design"
git checkout master
git merge feature/administration
git merge feature/marketing
git merge feature/crm
git merge feature/products
```

## Tips

1. **One feature per worktree** - Keep each worktree focused
2. **Regular commits** - Commit frequently to avoid losing work
3. **Test before merging** - Test each branch thoroughly
4. **Sync regularly** - Pull latest changes from remote

## Need Help?

See `PARALLEL_DEVELOPMENT_SETUP.md` for detailed documentation.

