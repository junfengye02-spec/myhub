# Yven 个人站生产环境 CI/CD

生产分支为 `main`。推送到该分支后，GitHub Actions 会构建 Linux AMD64 Docker 镜像，通过专用 SSH 密钥上传到生产服务器，再由服务器端发布程序切换版本。

## 生产环境

- 仓库：`git@github.com:junfengye02-spec/myhub.git`
- 域名：`https://yven.0000238.xyz`
- 健康检查：`https://yven.0000238.xyz/healthz`
- 服务器：`154.44.1.62`
- 发布用户：`deploy`
- 项目目录：`/opt/yven-site`
- 发布程序：`/usr/local/sbin/yven-site-deploy`
- 容器：`yven-site-web`

## 自动发布流程

1. `.github/workflows/deploy-production.yml` 构建 `yven-site:git-<提交 SHA>`。
2. 镜像压缩后上传到 `/home/deploy/uploads/`。
3. 服务器发布程序获取独占锁，校验文件路径、提交 SHA 和镜像标签。
4. 仅重建 `yven-site-web`，不重建 Caddy 或其他项目容器。
5. 容器内 `/healthz` 和公网 `/healthz` 都通过后才算成功。
6. 检查失败时自动恢复上一镜像。
7. 成功后保留当前镜像和一个回滚镜像，并清理临时上传包。

## GitHub Actions Secrets

- `DEPLOY_HOST`：生产服务器 IP。
- `DEPLOY_USER`：固定为 `deploy`。
- `DEPLOY_SSH_KEY`：此仓库专用的发布私钥。
- `DEPLOY_KNOWN_HOSTS`：生产服务器 SSH 主机公钥记录。

任何密码、SSH 私钥和服务器环境变量都不能提交到 Git。

## 发布与回滚

日常发布：

```bash
git push origin main
```

代码回退使用反向提交，随后走同一条 CI/CD：

```bash
git revert <commit-sha>
git push origin main
```

不要强制推送已经发布的 `main` 分支。
