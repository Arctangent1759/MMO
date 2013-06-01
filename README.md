Top Down Shooter (name tbd)
===========================
+ A simple MMO 

Instructions
------------
+ install node (using package manager or from http://nodejs.org/)
+ install box2d: npm install box2d
+ install socket.io: npm install socket.io
+ install mongodb node driver: npm install mongodb
+ install mongod daemon: http://docs.mongodb.org/manual/installation/
+ start the mongod daemon:
  + Ubuntu: From terminal, sudo service mongodb start
  + Windows: From cmd, C:\mongodb\bin\mongod.exe
+ running: node index.js

Modules
-------

###Client
+ User Input
  + TBD
+ Graphics
  + assets/js/main.js: paint()
  + assets/html/index.html
+ Update
  + assets/js/main.js: update()

###Server
+ User Input
  + handle.js (?)
+ Physics
  + game.js: gameLoop()

Assignments
-----------
+ Alex: User Input (serverside)
+ Nitin: Physics
+ Kara: Graphics
+ Will: Update
+ Robert: User Input (clientside)
