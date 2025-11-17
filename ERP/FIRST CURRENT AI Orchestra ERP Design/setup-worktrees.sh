#!/bin/bash
# Setup script for creating 4 Git worktrees for parallel development
# This allows running 4 branches simultaneously on different ports

echo "========================================"
echo "Setting up 4-branch parallel development"
echo "========================================"
echo ""

# Get the current directory
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$CURRENT_DIR"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "ERROR: Not in a Git repository!"
    exit 1
fi

# Check if branches exist, create them if they don't
echo "Checking/creating feature branches..."
git branch --list feature/administration > /dev/null 2>&1 || git checkout -b feature/administration
git branch --list feature/marketing > /dev/null 2>&1 || git checkout -b feature/marketing
git branch --list feature/crm > /dev/null 2>&1 || git checkout -b feature/crm
git branch --list feature/products > /dev/null 2>&1 || git checkout -b feature/products
git checkout master > /dev/null 2>&1

echo ""
echo "Creating worktrees in sibling directories..."
echo ""

# Create worktrees in parent directory
PARENT_DIR="$(dirname "$CURRENT_DIR")"

# Administration worktree
if [ -d "$PARENT_DIR/administration" ]; then
    echo "WARNING: administration directory already exists. Skipping..."
else
    echo "Creating administration worktree..."
    if git worktree add "$PARENT_DIR/administration" feature/administration; then
        echo "✓ Administration worktree created"
    else
        echo "ERROR: Failed to create administration worktree"
    fi
fi

# Marketing worktree
if [ -d "$PARENT_DIR/marketing" ]; then
    echo "WARNING: marketing directory already exists. Skipping..."
else
    echo "Creating marketing worktree..."
    if git worktree add "$PARENT_DIR/marketing" feature/marketing; then
        echo "✓ Marketing worktree created"
    else
        echo "ERROR: Failed to create marketing worktree"
    fi
fi

# CRM worktree
if [ -d "$PARENT_DIR/crm" ]; then
    echo "WARNING: crm directory already exists. Skipping..."
else
    echo "Creating CRM worktree..."
    if git worktree add "$PARENT_DIR/crm" feature/crm; then
        echo "✓ CRM worktree created"
    else
        echo "ERROR: Failed to create CRM worktree"
    fi
fi

# Products worktree
if [ -d "$PARENT_DIR/products" ]; then
    echo "WARNING: products directory already exists. Skipping..."
else
    echo "Creating products worktree..."
    if git worktree add "$PARENT_DIR/products" feature/products; then
        echo "✓ Products worktree created"
    else
        echo "ERROR: Failed to create products worktree"
    fi
fi

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Directory structure:"
echo "  $PARENT_DIR"
echo "  ├── FIRST CURRENT AI Orchestra ERP Design/  (main/master)"
echo "  ├── administration/  (feature/administration - Port 3000)"
echo "  ├── marketing/       (feature/marketing - Port 3001)"
echo "  ├── crm/             (feature/crm - Port 3002)"
echo "  └── products/        (feature/products - Port 3003)"
echo ""
echo "Next steps:"
echo "1. Navigate to each worktree directory"
echo "2. Run npm install in each (if needed)"
echo "3. Start dev servers:"
echo "   - administration: npm run dev:admin"
echo "   - marketing: npm run dev:marketing"
echo "   - crm: npm run dev:crm"
echo "   - products: npm run dev:products"
echo ""

