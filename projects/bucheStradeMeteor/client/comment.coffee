Meteor.methods

  comment: (commentAttributes) ->
    #var user = Meteor.user()
    #var post = Posts.findOne(commentAttributes.postId);
    # ensure the user is logged in
    #if (!user)
    #  throw new Meteor.Error(401, "You need to login to make comments");
    #if (!commentAttributes.body)
    #  throw new Meteor.Error(422, 'Please write some content');
    #if (!post)
    #  throw new Meteor.Error(422, 'You must comment on a post');
    #if commentAttributes.body.length > 360
    #  throw new Meteor.Error(422, 'Il commento deve essere più corto di 360 caratteri');

    comment = _.extend(_.pick(commentAttributes, 'postId', 'body'), {
      #userId: user._id,
      #author: user.username,
      submitted: new Date().getTime()
    })
    Comments.insert(comment)
  