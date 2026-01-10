package main

import (
	"fmt"

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

	return router.Run(fmt.Sprintf(":%d", port))
}
