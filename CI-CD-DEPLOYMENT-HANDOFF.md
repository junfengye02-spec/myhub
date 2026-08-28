# Yven 个人站生产环境 CI/CD 交接说明

## 当前环境

| 项目 | 当前值 |
| --- | --- |
| GitHub 仓库 | `git@github.com:junfengye02-spec/myhub.git` |
| 生产分支 | `main` |
| 生产服务器 | `154.44.1.62` |
| 发布用户 | `deploy` |
| 生产域名 | `https://yven.0000238.xyz` |
| 健康检查 | `https://yven.0000238.xyz/healthz` |
| 服务器项目目录 | `/opt/yven-site` |
| 服务器上传目录 | `/home/deploy/uploads` |
| 服务器发布程序 | `/usr/local/sbin/yven-site-deploy` |
| Docker Compose 项目名 | `yven-site` |
| 应用容器 | `yven-site-web` |

域名由 Cloudflare 代理到服务器。Caddy 负责 HTTPS，并通过共享 Docker 网络把请求转发到站点容器的 `8080` 端口。

## CI/CD 触发

- `.github/workflows/ci.yml`：Pull Request、非 `main` 分支推送或手动运行时执行依赖安装和 Astro 构建。
- `.github/workflows/deploy-production.yml`：向 `main` 推送或手动运行时构建并发布生产镜像。
- 生产发布启用了并发锁，同一时间只执行一个发布。

## 自动发布流程

1. GitHub Actions 用锁文件安装依赖并构建静态站。
2. 构建 `linux/amd64` 镜像 `yven-site:git-<完整提交 SHA>`。
3. 将镜像压缩并通过专用 SSH 密钥上传到 `/home/deploy/uploads/`。
4. `deploy` 用户仅能通过 `sudo` 调用 `/usr/local/sbin/yven-site-deploy`。
5. 发布程序校验上传路径、镜像标签和提交 SHA，并获取文件锁。
6. 只重建 `yven-site-web`，不重建共享 Caddy 和其他项目。
7. 容器内 `/healthz` 和公网 `/healthz` 都通过后记录成功。
8. 失败时自动恢复上一镜像；成功后保留一个上一版本用于回滚。

## GitHub Actions Secrets

仓库需要以下 Secrets：

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_KNOWN_HOSTS`

不要提交 SSH 私钥、root 密码、Token 或服务器配置中的秘密。轮换密钥时，需要同时更新此仓库的 `DEPLOY_SSH_KEY` 和服务器 `deploy` 用户的 `authorized_keys`。

## 发布验证

```bash
curl --fail --silent --show-error https://yven.0000238.xyz/healthz
docker inspect --format '{{.Config.Image}} {{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{end}}' yven-site-web
```

应用镜像应为 `yven-site:git-<40 位提交 SHA>`，容器状态应为 `running healthy`。

## 回滚

发布脚本会在容器或公网健康检查失败时自动切回上一个镜像。主动回退代码时使用反向提交：

```bash
git log --oneline -10
git revert <需要撤销的提交 SHA>
git push origin main
```

不要对已发布的 `main` 分支强制推送，也不要直接修改共享 Caddy 容器或其他项目的数据卷。

## 关键文件

| 文件 | 用途 |
| --- | --- |
| `.github/workflows/ci.yml` | 常规构建检查 |
| `.github/workflows/deploy-production.yml` | 自动生产发布 |
| `Dockerfile` | 生产镜像构建入口 |
| `deploy/cicd/nginx.conf` | 容器内静态文件服务 |
| `deploy/cicd/docker-compose.yml` | 生产容器定义 |
| `deploy/cicd/yven-site-deploy.sh` | 服务器切换、健康检查和回滚 |
| `deploy/cicd/Caddyfile.yven` | 共享 Caddy 的域名配置片段 |
| `deploy/cicd/yven-site.sudoers` | 发布用户最小 sudo 权限 |
