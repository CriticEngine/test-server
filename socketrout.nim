import json, times, random, asyncdispatch, asynchttpserver

randomize()

type
  Client* = object
    secret*: string
    id*: string
    last_time*: int64
    nickname*:string
    x*,y*,z*: float32


proc timeChecker*(clients: var seq[Client]): void =
  if clients.len > 0:
    for cilent_n in countdown(clients.len-1, 0):
      if toUnix(getTime()) - clients[cilent_n].last_time > 10: 
        echo "KEKEKEKEKEKEKEK"
        clients.delete(cilent_n)

proc getAll*(clients: var seq[Client]): string =
  return $ %*{
    "status": true,
    "event": "getAll",
    "data": {
      "players": %clients # секрет исправить
    }
  }

proc update*(clients: var seq[Client], secret: string, data: JsonNode): string =
  if clients.len > 0:
    for cilent_n in 0..clients.len-1:
      if clients[cilent_n].secret == secret:        
        if data.contains("x"):
          clients[cilent_n].x = data["x"].getFloat(default=0)
        if data.contains("y"):
          clients[cilent_n].y = data["y"].getFloat(default=0)
        if data.contains("z"):
          clients[cilent_n].z = data["z"].getFloat(default=0)
  return clients.getAll()
       

proc auth*(clients: var seq[Client], secret: string, data: JsonNode): string =
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

proc router*(clients: var seq[Client], str:string): string =
  var json: JsonNode = %* {} 
  var secret: string 
  var event: string 
  var data: JsonNode = %* {"nil": true} 
  try:
    json = parseJson(str)
  except JsonParsingError:
    echo "JSON ERROR:" & str
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
  clients.timeChecker()

  case event:
  of "auth":
    return clients.auth(secret, data)
  of "update":
    return clients.update(secret, data)
  of "getAll":
    return clients.getAll()
  else:
    return $ %*{
      "status": false,
      "error": "Router error"
    }