package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/google/go-github/github"
	"github.com/thedevsaddam/renderer"
	"golang.org/x/oauth2"
)

// Pretty Print a struct.
func prettyPrint(i interface{}) string {
	s, _ := json.MarshalIndent(i, "", "\t")
	return string(s)
}

var rnd *renderer.Render

func init() {
	opts := renderer.Options{
		ParseGlobPattern: "tpl/*.html",
	}

	rnd = renderer.New(opts)
}

func home(w http.ResponseWriter, r *http.Request) {
	usr := struct {
		Name string
		ID   int
	}{
		Name: "John",
		ID:   001,
	}
	err := rnd.HTML(w, http.StatusOK, "home", usr)
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	mux := http.NewServeMux()
	ctx := context.Background()
	key := ""

	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: key},
	)
	tc := oauth2.NewClient(ctx, ts)
	client := github.NewClient(tc)

	// Display basic information about logged in user.
	user, _, err := client.Users.Get(ctx, "")
	if err != nil {
		fmt.Printf("%s", err)
		os.Exit(1)
	}
	fmt.Printf("Name: %s\nUsername: %s\nEmail: %s\nBio: %s\n\n", user.GetName(), user.GetLogin(), user.GetEmail(), user.GetBio())

	// Display repositories belonging to logged in user.
	repos, _, err := client.Repositories.List(ctx, "", nil)
	if err != nil {
		fmt.Printf("%s", err)
		os.Exit(1)
	}
	for _, repo := range repos {
		fmt.Printf("Repo Name: %s\nRepo URL: %s\n", repo.GetName(), repo.GetURL())
	}

	// Call html page handler.
	mux.HandleFunc("/", home)

	// Open port for web server.
	port := ":9000"
	log.Println("Listening on port", port)
	http.ListenAndServe(port, mux)

}
