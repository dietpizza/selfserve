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
		webPath := normalizeRootPath(c.Param("path"))
		fsPath, err := staticRootJoin(staticRoot, webPath)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		infoList, err := listFilesMetadata(fsPath, webPath)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, infoList)
	}
}

func deleteHandler(staticRoot string) gin.HandlerFunc {
	return func(c *gin.Context) {

		// get path from JSON body
		var req struct {
			Path string `json:"path"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
			return
		}

		fullPath, err := staticRootJoin(staticRoot, req.Path)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if fullPath == staticRoot {
			c.JSON(http.StatusBadRequest, gin.H{"error": "cannot delete root directory"})
			return
		}

		if err := deleteFile(fullPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "deleted"})
	}
}
