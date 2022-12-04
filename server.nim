import jester, asyncdispatch, strutils

import socketrout


router routes:
  get "/":
    redirect uri("/index.html")
  get "/404":
    resp "404 ERROR"
  error Exception:
    resp Http500, "Something bad happened: " & exception.msg
  error Http404:
    redirect uri("/404")

let s = newSettings(
  Port(2222),
  bindAddr="127.0.0.1",
)
var jest = initJester(routes, s)
jest.serve()