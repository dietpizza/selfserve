package main

import (
	"os"

	"github.com/urfave/cli"
)

const (
	defaultRoot = "."
	defaultPort = 8080
)

func main() {
	app := cli.NewApp()
	app.Name = "selfserve-daemon"
	app.Usage = "When you really need to serve some files over HTTP"
	app.Flags = []cli.Flag{
		cli.StringFlag{
			Name:  "root, r",
			Usage: "Directory exposed under /files",
			Value: defaultRoot,
		},
		cli.IntFlag{
			Name:  "port, p",
			Usage: "Port to bind the HTTP server",
			Value: defaultPort,
		},
	}
	app.Action = func(c *cli.Context) error {
		return runServer(c.String("root"), c.Int("port"))
	}

	if err := app.Run(os.Args); err != nil {
		panic(err)
	}
}
