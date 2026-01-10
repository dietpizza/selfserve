package main

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"syscall"
)

// staticRootJoin joins staticRoot and rel safely and prevents escaping
// outside of staticRoot via .. segments.
func staticRootJoin(root, rel string) (string, error) {
	joined := filepath.Clean(filepath.Join(root, rel))

	absRoot, err := filepath.Abs(filepath.Clean(root))
	if err != nil {
		return "", fmt.Errorf("unable to resolve root: %w", err)
	}
	absJoined, err := filepath.Abs(joined)
	if err != nil {
		return "", fmt.Errorf("unable to resolve joined path: %w", err)
	}

	if !strings.HasPrefix(absJoined, absRoot) {
		return "", fmt.Errorf("path escapes configured root")
	}
	return joined, nil
}

// FileMeta contains file metadata for responses.
type FileMeta struct {
	Filename string `json:"filename"`
	Mtime    int64  `json:"mtime"`
	Ctime    int64  `json:"ctime"`
	Size     int64  `json:"size"`
}

func listFilesMetadata(path string) ([]FileMeta, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	infos, err := f.Readdir(-1)
	if err != nil {
		return nil, err
	}

	var out []FileMeta
	for _, fi := range infos {
		if fi.IsDir() {
			continue
		}
		var ctime int64
		if statT, ok := fi.Sys().(*syscall.Stat_t); ok {
			ctime = statT.Ctim.Sec
		} else {
			ctime = fi.ModTime().Unix()
		}

		out = append(out, FileMeta{
			Filename: fi.Name(),
			Mtime:    fi.ModTime().Unix(),
			Ctime:    ctime,
			Size:     fi.Size(),
		})
	}

	// Sort by Mtime descending (newest first)
	sort.Slice(out, func(i, j int) bool {
		return out[i].Mtime > out[j].Mtime
	})

	return out, nil
}
