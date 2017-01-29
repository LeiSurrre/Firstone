var model = (function() {
    "use strict";
    
    var model = {};

    // Message constructor
    var Comment = (function () {
        var cmtid = 0;
        return function Comment(comment) {
            if (comment.id) {
                this.id = comment.id;
                cmtid = (comment.id>=cmtid)? comment.id+1 : cmtid;
            } else {
                this.id = cmtid++;
            }
            this.content = comment.content;
            this.author = comment.author;
            this.time = comment.time;
        }
    }());

    // Post constructor
    var Post = (function () {
        var id = 0;
        return function Post(data) {
            if (data.id) {
                this.id = data.id;
                id = (data.id>=id)? data.id+1 : id;
            } else {
                this.id = id++;
            }
            this.url = data.url;
            this.title = data.title;
            this.author = data.author;
            this.comments = [];
        }
    }());

    // store posts
    var posts = [];

    model.picToggle = function(data) {
        document.dispatchEvent(new CustomEvent('onNewPicToggleClick', {'detail': data}));
    };

    model.uploadPicRadio = function(data) {
        document.dispatchEvent(new CustomEvent('onNewMethodSelected', {'detail': data}));
    };

    model.createPost = function(data) {
        var post = new Post(data);
        posts.push(post);
        localStorage.setItem("posts", JSON.stringify(posts));
        document.dispatchEvent(new CustomEvent("postCreated", {'detail': posts[posts.length - 1]}));
    };

    model.createComment = function(data) {
        var comment = new Comment(data);
        var currPid = data.postId;
        var i = 0;
        while (currPid !== posts[i].id && i < posts.length) {
            if (i < posts.length - 1) {
                i++;
            } else {
                console.log("bad!!!!!");
            }
        }
        var currPost = posts[i];
        currPost.comments.unshift(comment);
        localStorage.setItem("posts", JSON.stringify(posts));
        var page = 1;
        var cmtDisplay = [];
        var i = (page - 1)*10;
        while (i < page*10 && i < currPost.comments.length) {
            cmtDisplay.push(currPost.comments[i]);
            i++;
        }
        data = {'page': page, 'cmtDisplay': cmtDisplay};
        document.dispatchEvent(new CustomEvent("commentCreated", {'detail': data}));
    };

    model.changePost = function(data) {
        if (posts.length > 1) {
            var direction = data.direction;
            var currPid = data.currPid;
            var i = 0;
            while (currPid !== posts[i].id && i < posts.length) {
                if (i < posts.length - 1) {
                    i++;
                } else {
                    console.log("bad!!!!!");
                }
            }
            if (direction === 'left') {
                if (i === 0) {
                    i = posts.length - 1;
                } else {
                    i--;
                }
            } else if (direction === 'right') {
                if (i === posts.length - 1) {
                    i = 0;
                } else {
                    i++;
                }
            }

            var page = 0;
            var cmtDisplay = [];
            var currPost = posts[i];
            if (currPost.comments.length > 0) {
                page = 1;
                i = (page - 1)*10;
                while (i < page*10 && i < currPost.comments.length) {
                    cmtDisplay.push(currPost.comments[i]);
                    i++;
                }
            }
            data = {'post': posts[i], 'page': page, 'cmtDisplay': cmtDisplay}
            document.dispatchEvent(new CustomEvent("postChanged", {'detail': data}));
        }
    };

    model.changePage = function(data) {
    	console.log(data);
        var page = data.page;
        var currPid = data.currPid;
        var change = data.change;
        var cmtDisplay = [];
        var i = 0;
        while (currPid !== posts[i].id && i < posts.length) {
            if (i < posts.length - 1) {
                i++;
            } else {
                console.log("bad!!!!!");
            }
        }
        var currPostCmts = posts[i].comments;
        if (change === "first") {
            page = 1;
        } else if (change === "prev") {
            if (page > 1) {
                page -= 1;
            }
        } else if (change === "next") {
            if (page*10 < currPostCmts.length) {
                page += 1;
            }
        } else if (change === "last") {
            page = parseInt(currPostCmts.length/10) + 1;
        }

        i = (page - 1)*10;
        while (i < page*10 && i < currPost.comments.length) {
            cmtDisplay.push(currPost.comments[i]);
            i++;
        }

        data = {'page': page, 'cmtDisplay': cmtDisplay};
        document.dispatchEvent(new CustomEvent("pageChanged", {'detail': data}));
    };

    model.deletePost = function(data) {
        var currPid = data.currPid;
        var noMorePosts = false;
        var nextPost;
        if (posts.length <= 1) {
            noMorePosts = true;
        } else {
            var i = 0;
            while (currPid !== posts[i].id && i < posts.length) {
                if (i < posts.length - 1) {
                    i++;
                } else {
                    console.log("bad!!!!!");
                }
            }
            if (i > 0) {
                i -= 1;
            } else if (i === 0) {
                i = 1;
            }
            nextPost = posts[i]; 
        }

        var page = 0;
        var cmtDisplay = [];
        if (nextPost.comments.length > 0) {
            page = 1;
            i = (page - 1)*10;
            while (i < page*10 && i < nextPost.comments.length) {
                cmtDisplay.push(nextPost.comments[i]);
                i++;
            }
        }
        data = {'post': posts[i], 'page': page, 'cmtDisplay': cmtDisplay}

        posts = posts.filter(function(e){
            return (e.id !== currPid);
        });
        localStorage.setItem("posts", JSON.stringify(posts));
        document.dispatchEvent(new CustomEvent("postDeleted",{'detail': data}));
    };

    model.deleteCmt = function(data) {
        var currPid = data.currPid;
        var currCid = data.currCid;
        var page = data.page;
        var cmtDisplay = [];
        var i = 0;
        while (currPid !== posts[i].id && i < posts.length) {
            if (i < posts.length - 1) {
                i++;
            } else {
                console.log("bad!!!!!");
            }
        }
        var currPost = posts[i];
        currPost.comments = currPost.comments.filter(function(e){
            return (e.id !== currCid);
        });
        localStorage.setItem("posts", JSON.stringify(posts));
        if (currPost.comments.length === 0) {
            page = 0;
        } else if (currPost.comments.length <= (page-1)*10) {
        	page -= 1;
        }
        i = (page - 1)*10;
        while (i < page*10 && i < currPost.comments.length) {
            cmtDisplay.push(currPost.comments[i]);
            i++;
        }
        data = {'page': page, 'cmtDisplay': cmtDisplay};
        document.dispatchEvent(new CustomEvent("commentDeleted", {'detail': data}));
    }

    return model;
    
}());
