# Scripted Browser

Little extension just to make your own scripts to run, and with an additional feature to open an URL webview (not all websites allow this, because of Content Security Policy that affects the iframe permissions).

## Extension Settings

Openning JSON settings you can create some scripts as the following example shows:

```json
{
  ...
  "scripted-browser.scripts": [
    {
      "name": "Run Script and Open URL",
      "script": "echo 'Running script...'", // Optional
      "isSidePanel": false, // Optional, default is false
      "url": "https://example.com" // Optional
    }
  ],
  ...
}
```

## Release Notes

### 0.1.0

Initial release of scripted-browser, opening tabs using iframes.