# Deploy QuickWheels to GitHub Pages

Only the contents of `Code/` are deployable. In the GitHub repository, `index.html`, `404.html`, `.nojekyll`, `css/`, `js/`, and `components/` must be at the repository root—not inside another `Code/` directory.

## 1. Create and push the repository

Open a terminal inside `Code/`, then run:

```bash
git init
git add .
git commit -m "Add QuickWheels prototype"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

Replace `<user>` and `<repo>` with the real GitHub account and repository names.

## 2. Enable GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the default branch (`main`) and folder **/ (root)**.
5. Select **Save** and wait for the deployment to finish.

The site will be available at:

```text
https://<user>.github.io/<repo>/
```

## 3. Verify the deployment

- Open the root URL and complete the journey through the trip receipt.
- Refresh on routes such as `#/shared`, `#/pickup`, and `#/trip`.
- Confirm fetched header, banner, and help sheet load.
- Open an invalid path such as `/missing-page`; `404.html` should return to the app.
- Confirm the browser console has no failed asset requests.

The app uses only relative paths and hash routes, so a project-site subpath needs no configuration changes.
