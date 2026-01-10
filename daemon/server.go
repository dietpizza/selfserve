package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func runServer(staticRoot string, port int) error {
	router := gin.Default()

	api := router.Group("/api")
	{
		api.GET("/health", healthHandler)
		api.GET("/list/*path", dirListHandler(staticRoot))
	}

	// Expose files beneath staticRoot at /files
	router.StaticFS("/files", gin.Dir(staticRoot, false))

	// Serve embedded React build at /
	buildFS := ReactBuildFS()

	// Serve static files and SPA fallback
	fsHandler := http.FileServer(buildFS)

	// Serve static files and SPA fallback using NoRoute so existing routes (like /api) take precedence
	router.NoRoute(func(c *gin.Context) {
		// use request URL path
		reqPath := c.Request.URL.Path
		if reqPath == "/" || reqPath == "" {
			reqPath = "/index.html"
		}

		f, err := buildFS.Open(reqPath[1:])
		if err == nil {
			defer f.Close()
			if fi, fiErr := f.Stat(); fiErr == nil && !fi.IsDir() {
				// serve the file
				fsHandler.ServeHTTP(c.Writer, c.Request)
				return
			}
		}

		// fallback to index.html
		r, err := buildFS.Open("index.html")
		if err != nil {
			c.String(500, "index.html not found")
			return
		}
		defer r.Close()
		if fi, fiErr := r.Stat(); fiErr == nil {
			http.ServeContent(c.Writer, c.Request, "index.html", fi.ModTime(), r)
			return
		}
		// last resort: use current time
		http.ServeContent(c.Writer, c.Request, "index.html", time.Now(), r)
	})

	return router.Run(fmt.Sprintf(":%d", port))
}

// statModTime returns the modification time of the file if available, otherwise zero time
// note: no helper needed
