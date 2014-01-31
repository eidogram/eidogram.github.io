root = this ? exports

Template.info.events

  'click #information': (e) ->
    e.preventDefault()
    $("#informationDiv").collapse('toggle')
    if $("#userDiv").hasClass('in')
        $("#userDiv").collapse('toggle')
    if $("#title").hasClass('in')
        $("#title").collapse('toggle')


  'click #home': (e) ->
    e.preventDefault()
    $(".in").collapse('toggle')
    if root.tmpMarker?
      $("#home").toggleClass("fa-map-marker fa-undo")
      root.map.removeLayer(root.tmpMarker)
      root.tmpMarker = undefined
    Meteor.setTimeout () ->
      if not $("#title").hasClass("in")
        $("#title").collapse('show')
    , 500  
    delete Session.keys["latlng"]
    #Markers.remove Session.get("newPost")
    #root.map.removeLayer(root.newMarker)
    delete Session.keys['clicked']


  'click #user': (e) ->
    e.preventDefault()
    $("#userDiv").collapse('toggle')
    if $("#informationDiv").hasClass('in')
        $("#informationDiv").collapse('toggle')
    if $("#title").hasClass('in')
        $("#title").collapse('toggle')
    
  'click #plus': (e) ->
    e.preventDefault()
    root.map.zoomIn()

  'click #minus': (e) ->
    e.preventDefault()
    root.map.zoomOut()
