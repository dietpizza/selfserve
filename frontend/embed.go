package frontend

import (
	"embed"
	"io/fs"
)

//go:embed dist/*
var WebBuildFS embed.FS

// DistFS returns the dist/ subtree as an fs.FS for consumers like the daemon.
func DistFS() fs.FS {
	sub, err := fs.Sub(WebBuildFS, "dist")
	if err != nil {
		panic(err)
	}
	return sub
}
