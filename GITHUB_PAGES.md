# GitHub Pages package

Repository: https://github.com/abirhadi/abirhadi.github.io

GitHub Pages URL: https://abirhadi.github.io/

## Automatic deployment from source

The repository includes the React source and `.github/workflows/deploy.yml`. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**. Pushes to `main` build, check, and deploy the site. Pull requests run the checks without deploying.

The workflow defaults to the GitHub Pages URL with no custom domain. No DNS change is required. Canonical and social metadata retain the portfolio's configured production domain, `https://abirhadi.phd/`.

To rebuild locally with Node.js 22.13 or later:

```sh
npm ci
npm run build:pages
```

The complete static site is in `github-pages/`, including the rendered HTML, JavaScript, CSS, fonts, licenses, social image, and `.nojekyll`. No Node.js process or backend is required on the host. This build uses a separate clean directory from `dist/`.

To preview and run the HTTP check in PowerShell:

```powershell
$env:SITE_OUT_DIR = 'github-pages'
npm run test:smoke
npm run preview -- --outDir github-pages
```

## Upload the already-built files manually

The provided `artifacts/abirhadi.github.io.zip` contains the site files at the archive root. Extract it before uploading; GitHub Pages does not serve the contents of an uploaded ZIP automatically.

1. Create or select a `gh-pages` branch in the repository.
2. Upload the **contents** of the extracted folder to that branch's root, including `index.html`, `assets/`, `licenses/`, and `.nojekyll`. Do not wrap them in an extra directory.
3. In **Settings → Pages**, choose **Deploy from a branch**, select `gh-pages` and **/(root)**, then save. This selects manual branch deployment instead of the source workflow.
4. Open https://abirhadi.github.io/ after GitHub finishes publishing.

For later custom-domain migration, use the DNS and HTTPS instructions in `README.md`. Set repository variable `SITE_PREVIEW=false` only when ready to configure `abirhadi.phd` in Pages settings. This package does not change DNS.
