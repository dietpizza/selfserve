package main

import (
	"net/http"

	frontend "github.com/dietpizza/selfserve/frontend"
)

// ReactBuildFS returns an http.FileSystem for the embedded React build directory.
func ReactBuildFS() http.FileSystem {
	return http.FS(frontend.DistFS())
}
