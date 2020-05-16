# TODO

I do not want to program a game engine!  
Use Singletons like: Event, Inventory, Player, Networking  
Add debug window: FPS (use Event)  

- client -> room based architecture
  - join room -> get info -> play -> leave room

global store with renderer, ticker, etc

join room -> load spritesheet -> listen to events -> spawn player object

- login will be seperate "game"
- game is just room based architecture

## interface

create a new button with hover / on click sprite ? both ?
create new modal
create tabbed modal

viewport!

- tileset = world
- square = player

networking

Scene load / destroy
scene switcher ??
scene class with static scene manager

just load all ressources on start

scene handling on load

# WIKI

app.ticker ?
app.ticker.add(cb)

how to replace a sprite on click? just swap out the sprite with another one
- write a button object with 2 states and on click

## UI

- having a global HUD Scale factor
- list of UI Groups with id as name (like 'inventory')
- on resize -> scale all groups and reposition them (scale * height, of group is new height)

- UI Groups (like inventory, action bar)
  - list of UI Elements
  - total height and width of the group with scale 1.0
  - anchor point (e.g. center bottom, right top corner, 1/3 width bottom)

- UI Element (like button)
  - x and y according to top left to fit with other children in group
  - interaction (on scroll, on click, etc.)
    - interaction library works for this ?

test: 3 buttons -> scale up and down see if they still be aligned

## Game Loop

- both are async functions
- physics loop
  - sync with server
  - fixed timestamp / interval time
  - take last loop time / current time and calculate based on delta time
- render loop
  - fixed / as fast as possible

## Network

- one rest server for lobby and general data
- https://github.com/uNetworking/uWebSockets.js on server
- write pub / sub on client which uses pub sub on server

- network entities which just listen on network events
- network dispatcher gets all messages and dispatches them to their entities

- client keeps past x inputs and replays them if the server corrects the state


## Backend

- different rooms with multiple stages
- room based level of interest with events
- rooms provide the client with following infos
  - inventory / character info / weapons / level / skills / etc...
- global info
 - clan / group / username / some chats
