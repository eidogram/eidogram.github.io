root = this ? exports

Template.confirm.events
  'click #btn-no': (e) ->
    e.preventDefault()
    $("#content-confirm").collapse('hide')
    Markers.remove Session.get("newDeliver")
    root.map.removeLayer(root.newMarker)
    delete Session.keys['clicked']
  'click #btn-yes': (e) ->
    e.preventDefault()
    $("#done").collapse('show')
    $("#content-confirm").collapse('hide')
    $("#title").collapse('hide')
    Session.set "done", "true"

