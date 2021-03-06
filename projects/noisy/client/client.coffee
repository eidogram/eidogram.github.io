root = this ? exports

# create marker collection
Meteor.subscribe('markers')
root.Markers = new Meteor.Collection('markers')

root.SoundsFS = new CollectionFS('sounds', { autopublish: false })

Session.set("rec","false")

Deps.autorun () ->
    Meteor.subscribe('clickedSound', Session.get("fileId"))

# resize the layout
root.resize = () ->
  newHeight = $(root).height()
  $("#map").css("height", newHeight)


Template.map.rendered = ->
  # resize on load
  root.resize()

  # resize on resize of root
  $(root).resize =>
    root.resize()
  
  ###
  # create a map in the map div, set the view to a given place and zoom
  root.map = L.map 'map', 
    doubleClickZoom: false
  .setView([49.25044, -123.137], 13)

  # add a CloudMade tile layer with style #997 - use your own cloudmade api key
  L.tileLayer "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
  #L.tileLayer('http://{s}.tile.cloudmade.com/API-key/997/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
  .addTo(root.map)
  ###

  # replace "toner" here with "terrain" or "watercolor"
  layer = new L.StamenTileLayer "toner"
  root.map = new L.Map "map", {
      center: new L.LatLng(4.80, 10.32)
      zoom: 8
      doubleClickZoom: true
      zoomControl: false
      }
  root.map.addLayer layer

  # create default image path
  L.Icon.Default.imagePath = 'packages/leaflet/images'

  myIcons = L.Icon.extend
    options:
        shadowUrl: '',
        iconSize:     [100, 100],
        shadowSize:   [0, 0],
        iconAnchor:   [18, 51],
        shadowAnchor: [0, 0],
        popupAnchor:  [-3, -76]

  myIcon0 = new myIcons {iconUrl: 'packages/leaflet/images/icoon.svg'}
  # first update file package.js
  #myIcon1 = new myIcons {iconUrl: 'packages/leaflet/images/icoon1.svg'}
  #myIcon2 = new myIcons {iconUrl: 'packages/leaflet/images/icoon2.svg'}
  #myIcon3 = new myIcons {iconUrl: 'packages/leaflet/images/icoon3.svg'}
  #myIcon4 = new myIcons {iconUrl: 'packages/leaflet/images/icoon4.svg'}
  #myIconsList = [myIcon1, myIcon2, myIcon3, myIcon4]

  ###
  root.circle = L.circle [51.508, -0.11], 1000,
    "id": "ciao"
    color: 'red'
    fillColor: '#f03'
    fillOpacity: 0.5
  root.circle.addTo(map)
  ###


  # click on the map and will insert the latlng into the markers collection 
  ###
  clickCount = 0
  root.map.on 'click', (e) ->
    if not Session.get("done")?
      clickCount += 1
      if (clickCount <= 1)
        Meteor.setTimeout () ->
          if clickCount <= 1 and not Session.get("clicked")?
            Session.set("clicked","true")
            id = Markers.insert {latlng: e.latlng}
            Session.set "newDeliver", id
            $("#content-confirm").collapse('show')
          clickCount = 0
        , 500
  ###

  loadOnClick = (myid) ->
    Session.set("fileId",myid)
    d3.select("#attesa").text("Download in corso..")
    M_f.toDown();
    if not $("#info").hasClass('in')
      $("#info").collapse('toggle')
    Meteor.setTimeout(() -> 
      root.runDown = M_f.loading()
    , 1500)
    SoundsFS.retrieveBlob myid, (fileItem) ->
            if fileItem.blob
                Meteor.setTimeout( ->
                  console.log("scaricato blob")
                  d3.select("#attesa").text("Finito, clicca Play")
                  Meteor.clearInterval(root.runDown)
                  M_f.toTria()
                  d3.select("#demo").attr("src", () -> URL.createObjectURL(fileItem.blob) )
                , 2500)
                #Session.set("url", URL.createObjectURL(fileItem.blob))
            else if fileItem.file
                Meteor.setTimeout( ->
                  console.log("scaricato file")
                  d3.select("#attesa").text("Finito, clicca Play")
                  Meteor.clearInterval(root.runDown)
                  M_f.toTria()
                  d3.select("#demo").attr("src", () -> URL.createObjectURL(fileItem.file) )
                , 2500)
                #Session.set("url", URL.createObjectURL(fileItem.file))  
            else
              console.log("nana")
            



  # watch the markers collection
  
  query = Markers.find({})
  query.observe
    added: (mark) ->
      #ii = myIconsList[Math.floor Math.random() * (4)]
      root.newMarker = L.marker(mark.latlng, {icon: myIcon0, opacity:0.8})
      .addTo(root.map)
      root.newMarker.on 'click', (e) ->
        loadOnClick(mark.idSound)
  

  $("#record").hover(
    () -> d3.select("#help").text("Registra 2 secondi di audio"),
    () -> d3.select("#help").text("")
  )

  $("#play").hover(
    () -> d3.select("#help").text("Riascolta l'audio registrato"),
    () -> d3.select("#help").text("")
  )

  $("#save").hover(
    () -> d3.select("#help").text("Salva l'audio sul server (attendere circa 30 secondi)"),
    () -> d3.select("#help").text("")
  )
