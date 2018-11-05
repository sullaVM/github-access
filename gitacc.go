package main

import (
	"context"
	"fmt"

	"github.com/google/go-github/github"
	"golang.org/x/oauth2"
)

func main() {
	ctx := context.Background()
	key := "d64e35f68a6d998fcefbc7a73c45a58af3ed2e73"

	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: key},
	)
	tc := oauth2.NewClient(ctx, ts)
	client := github.NewClient(tc)

	// list all repositories for the authenticated user
	repos, _, err := client.Repositories.List(ctx, "", nil)
	if err != nil {
		fmt.Errorf("%s", err)
	}

	for _, repo := range repos {
		fmt.Printf("%s\n", repo.GetFullName())
	}
}
