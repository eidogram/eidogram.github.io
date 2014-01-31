root = this ? exports

# create marker collection
Meteor.subscribe('markers')
root.Markers = new Meteor.Collection('markers')

Meteor.subscribe('comments')
root.Comments = new Meteor.Collection('comments')

root.TmpMark = new Meteor.Collection(null)

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
  layer = new L.StamenTileLayer "toner-lite"
  #layer.setOpacity(0.5)
  root.map = new L.Map "map", {
      center: new L.LatLng(45.08, 7.65)
      zoom: 12
      doubleClickZoom: true
      zoomControl: false
      closePopupOnClick:false
      }
  root.map.addLayer layer

  # create default image path
  L.Icon.Default.imagePath = 'packages/leaflet/images'

  myIcons = L.Icon.extend
    options:
        shadowUrl: '',
        iconSize:     [36, 51],
        shadowSize:   [0, 0],
        iconAnchor:   [18, 30],
        shadowAnchor: [0, 0],
        popupAnchor:  [0, -20]

  myIcon0 = new myIcons {iconUrl: 'packages/leaflet/images/icoon.svg'}
  # first update file package.js
  choice1 = new myIcons {iconUrl: 'packages/leaflet/images/choice1.svg'}
  choice2 = new myIcons {iconUrl: 'packages/leaflet/images/choice2.svg'}
  choice3 = new myIcons {iconUrl: 'packages/leaflet/images/choice3.svg'}

  tmpIcon = new myIcons {iconUrl: 'packages/leaflet/images/tmp.svg'}
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
  clickCount = 0
  root.map.on 'click', (e) ->
    console.log $(".leaflet-popup")[0]
    if not Session.get("done")?
      clickCount += 1
      if (clickCount <= 1)
        Meteor.setTimeout () ->
          if clickCount <= 1 and not Session.get("clicked")?
            Session.set("clicked","true")
            $("#home").toggleClass("fa-map-marker fa-trash-o")
            Session.set("latlng",e.latlng)
            TmpMark.insert {latlng: e.latlng}
            #id = Markers.insert {latlng: e.latlng}
            #Session.set "newPost", id
            $("#title").collapse('hide')
            if $("#done").hasClass('in')
              $("#done").collapse("toggle")
            $("#content-choose").collapse('show')
          clickCount = 0
        , 500




  # watch the markers collection
  tmpQuery = TmpMark.find({})
  tmpQuery.observe
    added: (mark) ->
      #ii = myIconsList[Math.floor Math.random() * (4)]
      root.tmpMarker = L.marker(mark.latlng, {icon: tmpIcon, opacity:1})
      .addTo(root.map)


  # watch the markers collection
  query = Markers.find({})
  query.observe
    added: (mark) ->
      #ii = myIconsList[Math.floor Math.random() * (4)]
      root.newMarker = L.marker(mark.latlng, {icon: ( -> 
        switch mark.choice
          when "#choice-1" then choice1
          when "#choice-2" then choice2
          when "#choice-3" then choice3
        )()
        ,
        opacity:1})
      .addTo(root.map)
      root.newMarker.bindPopup("Spazio riservato alla PA, utile per fornire indicazioni relative all'intervento",{"closeOnClick":false, "closeButton":true})
