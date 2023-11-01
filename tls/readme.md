## Add the generated certificate to the trusted store

### For Chrome:
- Open Chrome and go to chrome://settings/certificates or navigate to Settings -> Privacy and security -> Security -> Manage certificates.
- Go to the "Authorities" tab.
- Click on "Import" and select your certificate file (cert.pem).
- Check the box for "Trust this certificate for identifying websites" or similar, then click "OK".

### For Firefox:
- Open Firefox and go to about:preferences#privacy or navigate to Settings -> Privacy & Security -> View Certificates.
- Go to the "Authorities" tab.
- Click on "Import" and select your certificate file (cert.pem).
- Check the box for "Trust this CA to identify websites" or similar, then click "OK".

### For Safari:
- Open the "Keychain Access" application (you can find it using Spotlight).
- Drag and drop your certificate file (cert.pem) into the "System" keychain.
- Right-click on the imported certificate, select "Get Info", expand the "Trust" section, and set "When using this certificate" to "Always Trust".

## Point DNS to the server

```bash
sudo nvim /etc/hosts
```

Add the following lines:
```
127.0.0.1 example.com
127.0.0.1 example.org
127.0.0.1 local.dev
```

Restart the server and open
- https://[::1]:{port}
- https://example.com:{port}
- https://example.org:{port}
- https://local.dev:{port}

