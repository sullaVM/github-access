package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/google/go-github/github"
	"golang.org/x/oauth2"
)

func prettyPrint(i interface{}) string {
	s, _ := json.MarshalIndent(i, "", "\t")
	return string(s)
}

func main() {
	ctx := context.Background()
	key := "KEY"

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
	user, _, err := client.Users.Get(ctx, "")
	if err != nil {
		fmt.Errorf("%s", err)
	}
	fmt.Printf("%v\n%s", prettyPrint(user), prettyPrint(repos))
}
