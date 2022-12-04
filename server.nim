import jester, ws, ws/jester_extra, asyncdispatch, strutils

import socketrout


router routes:
  get "/ws":
    try:
      var ws = await newWebSocket(request)
      await ws.send("connected")
      while ws.readyState == Open:
        let packet = await ws.receiveStrPacket()
        await ws.send(router(packet))
    except WebSocketClosedError:
      echo "socket closed"
    result[0] = TCActionRaw # tell jester we handled the request
  get "/":
    redirect uri("/index.html")
  get "/404":
    resp "404 ERROR"
  error Exception:
    resp Http500, "Something bad happened: " & exception.msg
  error Http404:
    redirect uri("/404")
when isMainModule:
  let s = newSettings(
    Port(2222),
    bindAddr="127.0.0.1",
  )
  var jest = initJester(routes, s)
  jest.serve()