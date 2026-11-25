# Deploy

The site runs in a container on a home Raspberry Pi and is published through a
Cloudflare Tunnel (`cloudflared` reaches the `musica` container over the internal
Docker network `publica`; nothing is exposed on the host or the router).

Deploys are **pull-based**: a systemd timer checks `origin/main` every 2 minutes and,
when it moved, fast-forwards the checkout and rebuilds the container. GitHub never
gets access to the server, so no self-hosted runner is needed for this public repo.

## Install (once, on the Pi)

```bash
cd ~/code/musica.srmacedo.com
sudo install -m 755 deploy/deploy.sh /usr/local/sbin/musica-deploy
sudo install -D -m 644 deploy/compose.yaml /etc/musica/compose.yaml
sudo install -m 644 deploy/musica-deploy.service deploy/musica-deploy.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now musica-deploy.timer
```

The script, compose file and units are root-owned copies. After changing anything in
`deploy/`, run the install commands again — the timer does not update them by itself.

## Operate

```bash
systemctl list-timers musica-deploy.timer   # next run
journalctl -u musica-deploy -n 20           # deploy log
sudo systemctl start musica-deploy          # deploy now
```

The deploy is skipped (not failed) while the checkout is on another branch or has
uncommitted changes, so it is safe to work in the same directory.
