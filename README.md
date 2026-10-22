# QuickWheels prototype

A static, no-build prototype for predictable shared rides from Surat Railway Station. It demonstrates route setup, mode comparison, a fixed-fare shared booking, matching, privacy-safe ride confirmation, pickup-zone wayfinding, an active shared trip, payment settlement, and explicit recovery paths.

All ride, identity, location, call, safety, train and payment behavior is synthetic and runs only in the browser. No real service is contacted.

## Run locally

Do not open `index.html` with `file://`. From inside this folder, run:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

Progress is stored under the namespaced `quickwheels_demo_journey_v1` localStorage key. Use **Help → Restart prototype** to clear it.

## Publish

Push the **contents of this folder** as the root of a GitHub repository. Then enable GitHub Pages from the default branch and `/ (root)`. See [DEPLOY.md](DEPLOY.md) for the complete walkthrough.

No build command, dependency installation, API key, backend, service worker or CDN is required.
