import json, times, random, asyncdispatch, asynchttpserver

randomize()

type
  Client* = object
    secret*: string
    id*: string
    last_time*: int64
    nickname*:string
    x*,y*: int


var clients: seq[Client]


proc timeChecker*(): void =
  if clients.len > 0:
    for cilent_n in countdown(clients.len-1, 0):
      if toUnix(getTime()) - clients[cilent_n].last_time > 10: 
        echo "[DBG] Player " & clients[cilent_n].nickname & " deleted (time)"
        clients.delete(cilent_n)

proc getAll*(): string =
  return $ %*{
    "status": true,
    "event": "getAll",
    "data": {
      "players": %clients # секрет исправить
    }
  }

proc update*(secret: string, data: JsonNode): string =
  if clients.len > 0:
    for cilent_n in 0..clients.len-1:
      if clients[cilent_n].secret == secret:        
        if data.contains("x"):
          clients[cilent_n].x = data["x"].getInt(default=0)
        if data.contains("y"):
          clients[cilent_n].y = data["y"].getInt(default=0)
  return getAll()
       

proc auth*( secret: string, data: JsonNode): string =
  if clients.len > 0:
    for cilent_n in 0..clients.len-1:
      if clients[cilent_n].secret == secret:
        clients.delete(cilent_n)
  var newClient: Client      
  # Generate new secret
  for _ in .. 31:
    case rand(1..3):
    of 1:
      newClient.secret.add(char(rand(int('0') .. int('9'))))
    of 2:
      newClient.secret.add(char(rand(int('a') .. int('z'))))
    else:
      newClient.secret.add(char(rand(int('A') .. int('Z'))))
  for _ in 1..6:
      newClient.id.add(char(rand(int('0') .. int('9'))))   
  newClient.last_time = toUnix(getTime())
  if data.contains("nick"):
    newClient.nickname = data["nick"].getStr(default="NoName")
  clients.add(newClient)
  return $ %*
    {
      "status": true, 
      "event": "auth",  
      "id": newClient.id,
      "nick": newClient.nickname,
      "secret": newClient.secret,
    }

proc router*(str:string): string =
  var json: JsonNode = %* {} 
  var secret: string 
  var event: string 
  var data: JsonNode = %* {"nil": true} 
  try:
    json = parseJson(str)
  except JsonParsingError:
    echo "[DBG] JSON ERROR:" & str
  if json.contains("secret"):
    secret = json["secret"].getStr(default="")  
    if clients.len > 0: 
      for cilent_n in 0..clients.len-1:
        if clients[cilent_n].secret == secret:
          clients[cilent_n].last_time = toUnix(getTime())
  if json.contains("event"):
    event = json["event"].getStr(default="unknown")
  if json.contains("data"):
    data = json["data"]
  timeChecker()

  case event:
  of "auth":
    return auth(secret, data)
  of "update":
    return update(secret, data)
  of "getAll":
    return getAll()
  else:
    return $ %*{
      "status": false,
      "error": "Router error"
    }