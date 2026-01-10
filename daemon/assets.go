package main

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed web/*
var embeddedFiles embed.FS

// ReactBuildFS returns an http.FileSystem for the embedded React build directory.
func ReactBuildFS() http.FileSystem {
	sub, err := fs.Sub(embeddedFiles, "web")
	if err != nil {
		panic(err)
	}
	return http.FS(sub)
}
