(function(model, view){
    "use strict";

    // hide, show form
    document.addEventListener('onPicToggleClick', function(e){
        var data = e.detail;
        model.picToggle(data);
    });

    document.addEventListener('onNewPicToggleClick', function(e){
        var data = e.detail;
        view.displayPicForm(data);
    });

    // change upload method
    document.addEventListener('onUrlSelected', function(e){
        var data = e.detail;
        model.uploadPicRadio(data);
    });

    document.addEventListener('onUploadSelected', function(e){
        var data = e.detail;
        model.uploadPicRadio(data);
    });

    document.addEventListener('onNewMethodSelected', function(e){
        var data = e.detail;
        view.displayUploadMethod(data);
    });

    // submit a picture
    document.addEventListener('picFormSubmitted', function(e){
        var data = e.detail;
        model.createPost(data);
    });

    document.addEventListener('postCreated', function(e){
        var post = e.detail;
        view.addPost(post);
    });

    // next, prev picture
    document.addEventListener('picChangeClicked', function(e){
        var data = e.detail;
        model.changePost(data);
    });

    document.addEventListener('postChanged', function(e){
        var post = e.detail.post;
        view.changeToPost(post);
        var data = {'page': e.detail.page, 'cmtDisplay': e.detail.cmtDisplay};
        view.displayComments(data);
    });

    // delete image
    document.addEventListener('deleteClicked', function(e){
        var data = e.detail;
        model.deletePost(data);
    });

    document.addEventListener('postDeleted', function(e){
        var post = e.detail.post;
        view.changeToPost(post);
        var data = {'page': e.detail.page, 'cmtDisplay': e.detail.cmtDisplay};
        view.displayComments(data);
    });

    // leave comment
    document.addEventListener('commentSubmitted', function(e){
        var data = e.detail;
        model.createComment(data);
    });

    document.addEventListener('commentCreated', function(e){
        var data = e.detail;
        view.displayComments(data);
    });

    // delete comment
    document.addEventListener('deleteCmtClicked', function(e){
        var data = e.detail;
        model.deleteCmt(data);
    });

    document.addEventListener('commentDeleted', function(e){
        var data = e.detail;
        view.displayComments(data);
    });

    // commment change page
    document.addEventListener('pageChangeClicked', function(e){
        var data = e.detail;
        model.changePage(data);
    });

    document.addEventListener('pageChanged', function(e){
        var data = e.detail;
        view.displayComments(data);
    });

}(model,view));
