This service can embed and serve a React single-page app (SPA) from the `web/build` directory.

How to use

- Create a React app (e.g. with `create-react-app`) in `web/` or copy an existing build into `web/build`.
- Build the React app so that `web/build/index.html` and static assets exist.
- Build this Go service: `go build -o daemon .`
- Run: `./daemon` (or `make dev` if your Makefile supports it). The API remains under `/api` and the SPA is served at `/`.

Notes

- The project uses Go `embed` to include static assets at build time. If `web/build` is missing at build time, the Go build will fail.
- During development you can serve the React dev server separately and configure a proxy for API calls.
