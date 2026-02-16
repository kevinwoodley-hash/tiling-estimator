#!/bin/bash

# Professional Tiling Estimator - GitHub Setup Script
# This script helps you quickly initialize git and push to GitHub

echo "=========================================="
echo "Professional Tiling Estimator"
echo "GitHub Setup Script"
echo "=========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first:"
    echo "   https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " github_user
if [ -z "$github_user" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

# Get repository name
read -p "Enter repository name (default: tiling-estimator): " repo_name
repo_name=${repo_name:-tiling-estimator}

echo ""
echo "📝 Configuration:"
echo "   GitHub User: $github_user"
echo "   Repository:  $repo_name"
echo ""

# Confirm
read -p "Continue? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "🚀 Initializing Git repository..."

# Initialize git if not already initialized
if [ ! -d .git ]; then
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Update package.json with GitHub info
echo "📝 Updating package.json..."
if [ -f package.json ]; then
    # Use sed to replace yourusername with actual username
    sed -i.backup "s/yourusername/$github_user/g" package.json
    sed -i.backup "s/tiling-estimator/$repo_name/g" package.json
    rm package.json.backup 2>/dev/null
    echo "✅ package.json updated"
fi

# Update README.md with GitHub info
echo "📝 Updating README.md..."
if [ -f README.md ]; then
    sed -i.backup "s/yourusername/$github_user/g" README.md
    sed -i.backup "s/tiling-estimator/$repo_name/g" README.md
    rm README.md.backup 2>/dev/null
    echo "✅ README.md updated"
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Professional Tiling Estimator v1.0.0

- Multi-room calculator with area support
- Professional mode with business branding
- FreeAgent integration
- Local services search with geolocation
- 4 premium themes
- Mobile responsive design
- Complete material calculations
- Export to WhatsApp, File, and FreeAgent"

# Add remote
echo "🔗 Adding GitHub remote..."
git remote add origin "https://github.com/$github_user/$repo_name.git" 2>/dev/null || \
git remote set-url origin "https://github.com/$github_user/$repo_name.git"

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

echo ""
echo "=========================================="
echo "✅ Git Setup Complete!"
echo "=========================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Create repository on GitHub:"
echo "   https://github.com/new"
echo "   Repository name: $repo_name"
echo "   (Don't initialize with README)"
echo ""
echo "2. Push your code:"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Vercel:"
echo "   https://vercel.com/new"
echo "   Import your GitHub repository"
echo ""
echo "=========================================="
echo "🎉 Your app will be live in minutes!"
echo "=========================================="
