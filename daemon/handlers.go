package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func dirListHandler(staticRoot string) gin.HandlerFunc {
	return func(c *gin.Context) {
		relativePath := c.Param("path")

		if relativePath == "" || relativePath == "/" {
			relativePath = "."
		} else {
			if relativePath[0] == '/' {
				relativePath = relativePath[1:]
			}
		}

		fullPath, err := staticRootJoin(staticRoot, relativePath)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		infoList, err := listFilesMetadata(fullPath)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, infoList)
	}
}
