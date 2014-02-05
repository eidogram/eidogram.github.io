root = this ? exports

Template.zoom.events
  'click #zoom-in': (e) ->
    e.preventDefault()
    root.map.zoomIn()
  'click #zoom-out': (e) ->
    e.preventDefault()
    root.map.zoomOut()
  'click #open-menu': (e) ->
    e.preventDefault()
    $("#info").collapse('toggle')
