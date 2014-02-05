# marker collection
Markers = new Meteor.Collection('markers')
Meteor.publish 'markers', -> Markers.find()

SoundsFS = new CollectionFS('sounds', { autopublish: false })

Meteor.publish 'clickedSound', (fileId) ->
  console.log fileId
  return SoundsFS.find()