package main

import (
  "log"
  "net/http"
)

func main() {
  fs := http.FileServer(http.Dir("./dist"))
  http.Handle("/", fs)

  log.Println("Listening on :8888")

  err := http.ListenAndServe(":8888", nil)
  if err != nil {
    log.Fatal(err)
  }
}

