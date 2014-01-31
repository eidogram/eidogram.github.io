root = this ? exports

Template.choose.events

  'click #btn-1': (e) ->
    e.preventDefault()
    $("#choice-1").collapse('show')
    $("#content-choose").collapse('hide')
    #$("#title").collapse('hide')
    Session.set "choice", "#choice-1"

  'click #btn-2': (e) ->
    e.preventDefault()
    $("#choice-2").collapse('show')
    $("#content-choose").collapse('hide')
    #$("#title").collapse('hide')
    Session.set "choice", "#choice-2"

  'click #btn-3': (e) ->
    e.preventDefault()
    $("#choice-3").collapse('show')
    $("#content-choose").collapse('hide')
    #$("#title").collapse('hide')
    Session.set "choice", "#choice-3"


  
  # confirm buttons

  'click .btn-cancel': (e) ->
    e.preventDefault()
    root.map.removeLayer(root.tmpMarker)
    $(Session.get "choice").collapse('hide')
    $("#title").collapse('show')
    delete Session.keys["latlng"]
    #Markers.remove Session.get("newPost")
    #root.map.removeLayer(root.newMarker)
    delete Session.keys['clicked']

  'click .btn-confirm': (e) ->
    e.preventDefault()
    root.map.removeLayer(root.tmpMarker)
    $("#done").collapse('show')
    $("#home").toggleClass("fa-map-marker fa-undo")
    root.tmpMarker = undefined
    $(Session.get "choice").collapse('hide')
    $("#title").collapse('hide')
    d1 = Session.get "choice"
    d2 = Session.get "latlng"
    id = Markers.insert({choice: d1, latlng: d2})
    #delete Session.keys["latlng"]
    #Session.set "newPost", id
    #Session.set "done", "true"
    delete Session.keys['clicked']

  'click .btn-change': (e) ->
    e.preventDefault()
    $(Session.get "choice").collapse('hide')
    $("#content-choose").collapse('show')