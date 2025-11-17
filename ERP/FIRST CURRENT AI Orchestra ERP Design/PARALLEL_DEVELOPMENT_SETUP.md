# Parallel Development Setup Guide

This guide explains how to run 4 branches simultaneously on one machine with 4 screens/cursors.

## Overview

You can work on 4 different feature branches at the same time, each running on its own port:
- **Administration** → Port 3000
- **Marketing** → Port 3001
- **CRM** → Port 3002
- **Products** → Port 3003

## Quick Start

### 1. Run the Setup Script

**Windows:**
```bash
setup-worktrees.bat
```

**Linux/Mac:**
```bash
chmod +x setup-worktrees.sh
./setup-worktrees.sh
```

This will:
- Create 4 feature branches (if they don't exist)
- Set up Git worktrees in sibling directories
- Create the directory structure needed for parallel development

### 2. Install Dependencies (if needed)

Navigate to each worktree and install dependencies:

```bash
cd ../administration && npm install
cd ../marketing && npm install
cd ../crm && npm install
cd ../products && npm install
```

### 3. Start Development Servers

Open 4 terminals (one for each branch):

**Terminal 1 - Administration:**
```bash
cd ../administration
npm run dev:admin
```
Access at: http://localhost:3000

**Terminal 2 - Marketing:**
```bash
cd ../marketing
npm run dev:marketing
```
Access at: http://localhost:3001

**Terminal 3 - CRM:**
```bash
cd ../crm
npm run dev:crm
```
Access at: http://localhost:3002

**Terminal 4 - Products:**
```bash
cd ../products
npm run dev:products
```
Access at: http://localhost:3003

## Directory Structure

After setup, your directory structure will look like:

```
ERP/
├── FIRST CURRENT AI Orchestra ERP Design/  (main/master branch)
├── administration/  (feature/administration branch - Port 3000)
├── marketing/       (feature/marketing branch - Port 3001)
├── crm/             (feature/crm branch - Port 3002)
└── products/        (feature/products branch - Port 3003)
```

## How It Works

### Git Worktrees

Git worktrees allow you to have multiple working directories for the same repository. Each worktree:
- Has its own files and can be on a different branch
- Shares the same Git history and `.git` folder
- Can be worked on independently without conflicts

### Port Configuration

Each branch runs on a different port to avoid conflicts:
- Port 3000: Administration
- Port 3001: Marketing
- Port 3002: CRM
- Port 3003: Products

The port-specific scripts are defined in `package.json`:
```json
{
  "scripts": {
    "dev:admin": "next dev -p 3000",
    "dev:marketing": "next dev -p 3001",
    "dev:crm": "next dev -p 3002",
    "dev:products": "next dev -p 3003"
  }
}
```

## Environment Variables

Each worktree can have its own `.env.local` file if needed:

- `administration/.env.local`
- `marketing/.env.local`
- `crm/.env.local`
- `products/.env.local`

Or you can use the same Supabase credentials for all branches by copying `.env.local` to each worktree.

## Working with Branches

### Making Changes

1. Work in the appropriate worktree directory
2. Make your changes as normal
3. Commit changes in that worktree
4. The commits are automatically associated with the correct branch

### Switching Branches

You don't need to switch branches - each worktree is already on its branch:
- `administration/` is always on `feature/administration`
- `marketing/` is always on `feature/marketing`
- `crm/` is always on `feature/crm`
- `products/` is always on `feature/products`

### Syncing Changes

To pull latest changes from remote:
```bash
cd ../administration
git pull origin feature/administration
```

To push your changes:
```bash
cd ../administration
git push origin feature/administration
```

## Merging Work Back

When ready to combine all branches:

```bash
# In main project directory
cd "FIRST CURRENT AI Orchestra ERP Design"
git checkout master
git merge feature/administration
git merge feature/marketing
git merge feature/crm
git merge feature/products
```

## Troubleshooting

### Port Already in Use

If a port is already in use, you can:
1. Stop the process using that port
2. Or change the port in `package.json` and restart the dev server

### Worktree Already Exists

If you see "worktree already exists" errors:
1. Remove the existing worktree: `git worktree remove ../administration`
2. Or manually delete the directory and run setup again

### Changes Not Showing

If changes aren't showing:
1. Make sure you're working in the correct worktree directory
2. Check which branch you're on: `git branch`
3. Restart the dev server

### Cleaning Up

To remove all worktrees:
```bash
git worktree remove ../administration
git worktree remove ../marketing
git worktree remove ../crm
git worktree remove ../products
```

## Best Practices

1. **One feature per worktree**: Keep each worktree focused on its specific feature
2. **Regular commits**: Commit frequently to avoid losing work
3. **Sync regularly**: Pull latest changes from remote regularly
4. **Test before merging**: Test each branch thoroughly before merging to master
5. **Environment consistency**: Keep environment variables consistent across worktrees when possible

## Access URLs Summary

- **Screen 1 (Administration)**: http://localhost:3000
- **Screen 2 (Marketing)**: http://localhost:3001
- **Screen 3 (CRM)**: http://localhost:3002
- **Screen 4 (Products)**: http://localhost:3003

## Notes

- All worktrees share the same Git repository, so commits in one worktree are visible in all
- Each worktree has its own `node_modules` and build artifacts
- You can run all 4 dev servers simultaneously without conflicts
- File changes in one worktree don't affect others (they're on different branches)

