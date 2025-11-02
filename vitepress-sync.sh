#!/bin/bash
# ==============================================
# vitepress-sync.sh
# 本地同步 + 服务器构建 + GitHub推送
# ==============================================

SERVER="root@142.171.80.235"            # 服务器登录账号与IP
REMOTE_DIR="/www/wwwroot/vitepress"     # 服务器项目路径
LOCAL_DIR="$HOME/project/vitepress"     # 本地存放路径

EXCLUDES=(
  "--exclude=node_modules"
  "--exclude=.vitepress/dist"
  "--exclude=.git"
  "--exclude=yarn.lock"
  "--exclude=package-lock.json"
  "--exclude=.DS_Store"
  "--exclude=Thumbs.db"
)

show_help() {
  echo "用法: $0 [pull|push|build|gitpush|deploy]"
  echo
  echo "  pull    从服务器同步项目到本地"
  echo "  push    从本地同步项目到服务器"
  echo "  build   在服务器上执行 VitePress 构建"
  echo "  gitpush 在服务器上提交并推送到 GitHub"
  echo "  deploy  push + build + gitpush 一条命令完成"
  echo
}

pull() {
  echo "⬇ 从服务器拉取项目..."
  mkdir -p "$LOCAL_DIR"
  rsync -avz "${EXCLUDES[@]}" "$SERVER:$REMOTE_DIR/" "$LOCAL_DIR/"
  echo "✅ 拉取完成：$LOCAL_DIR"
}

push() {
  echo "⬆ 推送本地修改到服务器..."
  rsync -avz --delete "${EXCLUDES[@]}" "$LOCAL_DIR/" "$SERVER:$REMOTE_DIR/"
  echo "✅ 推送完成"
}

build() {
  echo "⚙ 在服务器执行 VitePress 构建..."
  ssh "$SERVER" "cd $REMOTE_DIR && npm run docs:build"
  echo "✅ 构建完成，文件已生成于 $REMOTE_DIR/.vitepress/dist/"
}

gitpush() {
  echo "📦 在服务器提交并推送 GitHub..."
  ssh "$SERVER" "cd $REMOTE_DIR && git add . && git commit -m 'Update VitePress site' && git push origin main"
  echo "✅ Git 推送完成"
}

deploy() {
  push
  build
  gitpush
  echo "🚀 部署完成！"
}

case "$1" in
  pull) pull ;;
  push) push ;;
  build) build ;;
  gitpush) gitpush ;;
  deploy) deploy ;;
  *) show_help ;;
esac
