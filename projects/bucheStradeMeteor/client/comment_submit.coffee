Template.commentSubmit.events

  'submit form': (e, template) ->
    e.preventDefault()

    $body = $(e.target).find('[name=body]')
    comment = {
      body: $body.val(),
      postId: Session.get "newPost"
    }

    Meteor.call 'comment', comment, (error, commentId) ->
      $body.val('')
      #if error
      #  throwError error.reason
      #else 
      #  $body.val('')