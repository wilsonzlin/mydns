# MyDNS

A customisable DNS server for your personal needs.

- Add blocklists to block [well-known](https://github.com/StevenBlack/hosts) malware sites, or any custom sites you want to black hole.
- Create custom mappings, like friendly names to machines on your local network or VPN.
- Secure your public DNS queries by using a private DNS-over-TLS provider, like [Cloudflare](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-tls/) or [Google](https://developers.google.com/speed/public-dns/docs/dns-over-tls), using Stubby.
- Programmatically update blocklists and mappings (e.g. scripting and scheduling), or use the built-in UX from any device.

## Getting started

MyDNS requires [dnsmasq](https://thekelleys.org.uk/dnsmasq/doc.html) and [stubby](https://dnsprivacy.org/dns_privacy_daemon_-_stubby/) to be installed and on your PATH. These should be available via your system's package manager. MyDNS also requires [Node.js](https://nodejs.org) for itself.

### Installing

To install, run the following command:

```bash
npm i -g mydns
```

npm's bin folder must be in your PATH. It's location can be found by running the command `npm bin -g`. You may need administrator/root privileges for the install.

### Running

Simply run the `mydns` command to start the server:

```bash
mydns --admin 8000 --dns 53 --state /path/to/state/dir
```

MyDNS requires a state directory for its exclusive use to hold blocklists and other information about itself; provide this directory using the `--state` CLI argument.

An HTTP server for the API and web app for configuration will listen on the port provided by the `--admin` argument.

The DNS server will listen on the port specified by the `--dns` argument.

### Using

Once MyDNS is running, you can start to point devices and clients to it to use MyDNS as their DNS resolver. This will vary by operating system; instructions for common devices can be found on [this page by Google](https://developers.google.com/speed/public-dns/docs/using#change_your_dns_servers_settings). Remember to use the IPv4 or IPv6 address of your machine running MyDNS.
