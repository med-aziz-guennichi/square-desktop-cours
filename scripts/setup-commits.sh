#!/bin/bash
# chmod +x ./scripts/setup-commits.sh
echo "🔧 Installing Commitizen, Commitlint, and Husky..."
npm install --save-dev commitizen cz-conventional-changelog @commitlint/cli @commitlint/config-conventional husky --force

echo "🧩 Configuring Commitizen..."
npx commitizen init cz-conventional-changelog --force --save-dev --save-exact

echo "📝 Setting commit message template..."
git config commit.template .gitmessage.txt

echo "🐶 Initializing Husky..."
bun run prepare
echo "🔗 Linking commit-msg hook..."

echo "npx --no-install commitlint --edit \$1" > .husky/commit-msg

echo "✅ Done! Try it by running: git commit"
