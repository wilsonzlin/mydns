# MyDNS

A customisable DNS server for your personal needs.

- Add blocklists to block [well-known](https://github.com/StevenBlack/hosts) malware sites, or any custom sites you want to black hole.
- Create custom mappings, like friendly names to machines on your local network or VPN.
- Secure your public DNS queries by using a private DNS-over-TLS provider, like [Cloudflare](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-tls/) or [Google](https://developers.google.com/speed/public-dns/docs/dns-over-tls).
- Programmatically update blocklists and mappings (e.g. scripting and scheduling), or use the built-in UX from any device.

## Getting started

MyDNS requires [dnsmasq](https://thekelleys.org.uk/dnsmasq/doc.html) and [stubby](https://dnsprivacy.org/dns_privacy_daemon_-_stubby/) to be installed and on your PATH. These should be available via your system's package manager. MyDNS also requires [Node.js](https://nodejs.org) for itself.

### Installing

To install, run the following command:

```bash
npm i -g mydns
```

npm's bin folder must be in your PATH. It's location can be found by running the command `npm bin -g`. You may need administrator/root privileges for the install.

<details>
<summary>Uninstalling</summary>

To uninstall, run `npm uninstall -g mydns`. Make sure it is not running.
</details>

### Running

Simply run the `mydns` command to start the server:

```bash
mydns --admin 8053 --dns 53 --state /path/to/state/dir
```

MyDNS requires a state directory for its exclusive use to hold blocklists and other information about itself; provide this directory using the `--state` CLI argument.

An HTTP server for the API and admin portal will listen on the port provided by the `--admin` argument.

The DNS server will listen on the port specified by the `--dns` argument.

### Using

Once MyDNS is running, you can start to point devices and clients to it to use MyDNS as their DNS resolver. This will vary by operating system; instructions for common devices can be found on [this page by Google](https://developers.google.com/speed/public-dns/docs/using#change_your_dns_servers_settings). Remember to use the IPv4 or IPv6 address of your machine running MyDNS.

Make sure the DNS port is not blocked by any firewall.

### Configuring via the admin portal

From the address of the admin portal (e.g. [localhost:8053](http://localhost:8053)), you'll see the overview screen showing active blocklists and custom mappings.

To add a blocklist, select [Add blocklist](http://localhost:8053/AddOrUpdateBlocklist), and enter the URL of the list. From the overview screen, you can update, disable/enable, and delete blocklists.

A blocklist is a text file where each line is a domain name. Blank lines and lines starting with `#` (comments) are ignored. You can create your own blocklists by creating a text file in this format and making it accessible via a URL.

To create custom mappings, select [Create new custom list](http://localhost:8053/CreateNewCustomList). All custom mappings must be in a custom list, but you can create multiple lists for organisation purposes. Once created, you'll be taken to the page for the list, where you can add new entries and delete existing ones. Each change is saved and effective immediately. From the overview page, you can view and access these lists, as well as quickly enable or disable an entire list.

### Running as background service

If you'd like to keep MyDNS running in the background and automatically starting it on startup, it's recommended to register it as a service. This process varies for each operating system. On a Linux machine with systemd, it's possible to create a systemd service by creating a file using the following template and writing it to `/etc/systemd/system/mydns.service`:

```
[Unit]
Description=mydns
Wants=network-online.target
After=network-online.target

[Service]
User=mydns
Group=mydns
ExecStart=/usr/bin/mydns --state /mydns-working-dir --dns 53 --admin 8053
SyslogLevelPrefix=no
StandardOutput=journal
StandardError=journal
Restart=no

[Install]
WantedBy=multi-user.target
```

Adjust the `ExecStart` command path and CLI arguments as necessary. It's recommended to create a system user and group dedicated for this service for security; adjust `User` and `Group` as necessary.

Once the file is in place, run:

```bash
systemctl daemon-reload
systemctl --now enable mydns
```

You may require `sudo` for the above commands. Some other relevant commands:

```bash
# View logs.
journalctl -e --no-hostname -u mydns.service

# Stop MyDNS until the system starts again.
systemctl stop mydns
# Start MyDNS if it's currently stopped.
systemctl start mydns

# Disable MyDNS from starting when the system starts.
systemctl disable mydns
# Re-enable MyDNS starting when the system starts.
systemctl enable mydns

# Delete the service (if uninstalling MyDNS) after it has already been disabled.
rm /etc/systemd/system/mydns.service
systemctl daemon-reload
```
