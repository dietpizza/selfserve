BINARY := daemon
DEVBINARY := daemon-dev
DISTDIR := dist

.PHONY: help dev release clean

help:
	@echo "Makefile targets:"
	@echo "  make dev       # run the service for development (go run)"
	@echo "  make dev-watch # run development server with auto-restart (CompileDaemon)"
	@echo "  make release   # build optimized release binary into $(DISTDIR)/"
	@echo "  make clean     # remove built artifacts"

dev:
	@echo "Starting development server..."
	go run .

dev-watch:
	@echo "Starting development server with watch (CompileDaemon required)"
	@echo "Install with: go install github.com/githubnemo/CompileDaemon@latest"
	CompileDaemon -directory=. -command="go run ." -exclude-dir=$(DISTDIR)

release: clean | $(DISTDIR)
	@echo "Building release binary into $(DISTDIR)/$(BINARY)"
	CGO_ENABLED=0 GOOS=$(shell go env GOOS) GOARCH=$(shell go env GOARCH) \
		go build -ldflags "-s -w" -o $(DISTDIR)/$(BINARY) ./...

$(DISTDIR):
	@mkdir -p $(DISTDIR)

clean:
	@echo "Cleaning..."
	@rm -rf $(DISTDIR)
