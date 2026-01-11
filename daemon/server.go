package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// corsMiddleware returns a Gin middleware that allows any origin and common methods/headers.
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func runServer(staticRoot string, port int) error {
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(corsMiddleware())
	// add logger similar to Default()
	router.Use(gin.Logger())

	api := router.Group("/api")
	{
		api.GET("/health", healthHandler)
		api.GET("/list/*path", dirListHandler(staticRoot))
		api.POST("/delete", deleteHandler(staticRoot))
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
