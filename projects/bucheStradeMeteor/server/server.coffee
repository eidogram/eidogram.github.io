# marker collection
Markers = new Meteor.Collection('markers')
Meteor.publish 'markers', -> Markers.find()

Comments = new Meteor.Collection('comments')
Meteor.publish 'comments', -> Comments.find()
