root = exports ? this

N = 1000
root.data = {}

uniqueId = (length=8) ->
  id = ""
  id += Math.random().toString(36).substr(2) while id.length < length
  id.substr 0, length

randomMarker = () ->
  [getRandomInt(-90,90), getRandomInt(-180,180)]

getRandomInt = (min, max) ->
   Math.floor(Math.random() * (max - min + 1)) + min


for i in [0..N]
  do () ->
    id = uniqueId()
    root.data[id] =
      'birth': randomMarker()
      'work': randomMarker()