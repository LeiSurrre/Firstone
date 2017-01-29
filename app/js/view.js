var view = (function(){
    "use strict";

    document.getElementById("pic_form_toggle").onclick = function(e) {
        e.preventDefault();
        var imageFormElement = document.getElementsByClassName('image_form_element');
        var picToggle = document.getElementById("pic_form_toggle");
        document.dispatchEvent(new CustomEvent('onPicToggleClick', {
            'detail': {
                'imageFormElement': imageFormElement,
                'picToggle': picToggle }
        }));
    };

    document.getElementById("file_url").onchange = function(e) {
        e.preventDefault();
        var radioValue = document.getElementById("file_url").value;
        document.dispatchEvent(new CustomEvent('onUrlSelected', {
            'detail': {
                'radioValue': radioValue }
        }));
    };

    document.getElementById("upload_file").onchange = function(e) {
        e.preventDefault();
        var radioValue = document.getElementById("upload_file").value;
        document.dispatchEvent(new CustomEvent('onUploadSelected', {
            'detail': {
                'radioValue': radioValue }
        }));
    };

    document.getElementById("upload_image_form").onsubmit = function(e) {
        e.preventDefault();
        var data = {};
        data.title = document.getElementById("enter_title").value;
        data.author = document.getElementById("enter_author").value;
        var urlRadio = document.getElementById("file_url");
        var uploadRadio = document.getElementById("upload_file");
        console.log(urlRadio.checked);
        console.log(uploadRadio.checked);
        if (urlRadio.checked) {
            data.url = document.getElementById("pic_url").value;
        } else if (uploadRadio.checked) {
            var imgFile = document.getElementById("pic_url");
            if (imgFile.files && imgFile.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var url = e.target.result;
                    console.log(e.target.result);
                    console.log(url);
                    data.url = e.target.result;
                };
            }
            reader.readAsDataURL(imgFile.files[0]);
        }
        if (data.title.length>0 && data.author.length>0 && data.url.length>0) {
            document.getElementById("upload_image_form").reset();
            document.dispatchEvent(new CustomEvent("picFormSubmitted", {'detail': data}));
        }
    };

    document.getElementById("left_btn").onclick = function(e) {
        e.preventDefault();
        if (document.getElementsByClassName("picture_box").length > 0) {
            var currPid = document.getElementsByClassName("picture_box")[0].id;
            document.dispatchEvent(new CustomEvent("picChangeClicked", {
                'detail': {
                    'currPid': currPid,
                    'direction': 'left'}
                }));
        }
    };

    document.getElementById("right_btn").onclick = function(e) {
        e.preventDefault();
        if (document.getElementsByClassName("picture_box").length > 0) {
            var currPid = document.getElementsByClassName("picture_box")[0].id;
            document.dispatchEvent(new CustomEvent("picChangeClicked", {
                'detail': {
                    'currPid': currPid,
                    'direction': 'right'}
                }));
        }
    };

    var view = {};

    view.displayPicForm = function(data) {
        var imageFormElement = data.imageFormElement;
        var picToggle = data.picToggle;
        var toggled = false;
        var i = 0;
        for (i; i < imageFormElement.length; i++) {
            if (imageFormElement[i].style.display == 'none' || imageFormElement[i].style.display == '') {
                imageFormElement[i].style.display = 'block';
                toggled = true;
            } else {
                imageFormElement[i].style.display = 'none';
                toggled = false;
            }
        };
        if (toggled) {
            picToggle.value = "close";
        } else {
            picToggle.value = "open to upload an image";
        };
    };

    view.displayUploadMethod = function(data) {
        var radioValue = data.radioValue;
        if (radioValue == 'url') {
            document.getElementById('choose_pic').innerHTML = `
                <input type="text" id="pic_url" class="image_form_element" placeholder="Enter the image url"/>`;
        } else if (radioValue == 'file') {
            document.getElementById('choose_pic').innerHTML = `
                <input type="file" id="pic_url" class="image_form_element">`;
        };
    };

    view.addPost = function(post) {
        var container = document.getElementById("picture_container");

        // add comment form
        var commentFormBox = document.getElementById("comment_form_box");
        commentFormBox.innerHTML = "";
        var commentForm = document.createElement('form');
        commentForm.className = "complex_form";
        commentForm.id = "comment_form";
        commentForm.innerHTML = `
            <div>Who are you?</div>
            <input placeholder="Enter your name" id="comment_writer"/>
            <div>Say something?</div>
            <textarea rows="4" placeholder="Enter your message" id="comment_message"></textarea>
            <input type="submit"/>`;
        commentForm.onsubmit = function(e) {
            e.preventDefault();
            var data = {};
            data.author = document.getElementById("comment_writer").value;
            data.content = document.getElementById("comment_message").value;
            var time = Date().toString();
            data.time = time.substring(0, 25);
            data.postId = post.id;
            console.log(post.id);
            if (data.author.length>0 && data.content.length>0) {
                document.getElementById("comment_form").reset();
                document.dispatchEvent(new CustomEvent("commentSubmitted", {'detail': data}));
            }
        };
        commentFormBox.append(commentForm);

        // add post
        container.innerHTML = "";
        var picBox = document.createElement('div');
        picBox.className = "picture_box";
        picBox.id = post.id;
        picBox.innerHTML = `<img src="${post.url}" class="picture">`;
        var picInfo = document.createElement('div');
        picInfo.className = "pic_info";
        picInfo.innerHTML = `
                    <div>Title: ${post.title}</div>
                    <div>By: ${post.author}</div>`;
        var deleteImage = document.createElement('div');
        deleteImage.id = "delete_image";
        deleteImage.innerHTML = "delete";
        deleteImage.onclick = function(e) {
            e.preventDefault();
            document.dispatchEvent(new CustomEvent("deleteClicked", {
                'detail': {
                    'currPid': post.id}
                }));
        };
        var commentBox = document.createElement('div');
        commentBox.id = "comments";
        commentBox.innerHTML = `
                <div><h2>Comments</h2></div>
                <div><hr></div>
                <div>No comments yet, be the first one to comment!</div>`;
        container.append(picBox);
        container.append(picInfo);
        container.append(deleteImage);
        container.append(commentBox);
    };

    view.changeToPost = function(post) {
        console.log(post);
        var container = document.getElementById("picture_container");
        var commentFormBox = document.getElementById("comment_form_box");
        container.innerHTML = "";
        if (post) {
            var picBox = document.createElement('div');
            picBox.className = "picture_box";
            picBox.id = post.id;
            picBox.innerHTML = `<img src="${post.url}" class="picture">`;
            var picInfo = document.createElement('div');
            picInfo.className = "pic_info";
            picInfo.innerHTML = `
                        <div>Title: ${post.title}</div>
                        <div>By: ${post.author}</div>`;
            var deleteImage = document.createElement('div');
            deleteImage.id = "delete_image";
            deleteImage.innerHTML = "delete";
            deleteImage.onclick = function(e) {
                e.preventDefault();
                document.dispatchEvent(new CustomEvent("deleteClicked", {
                    'detail': {
                        'currPid': post.id}
                    }));
            };
            var commentBox = document.createElement('div');
            commentBox.id = "comments";
            container.append(picBox);
            container.append(picInfo);
            container.append(deleteImage);
            container.append(commentBox);
        } else {
            container.innerHTML = `<div id="nothing">Nothing's<br>Here<br>Yet......</div>`;
            commentFormBox.innerHTML = "";
        }
    };

    view.displayComments = function(data) {
        var container = document.getElementById("comments");
        container.innerHTML = '';
        var page = data.page;
        var comments = data.cmtDisplay;
        console.log(document.getElementsByClassName("picture_box"));
        var currPid = document.getElementsByClassName("picture_box")[0].id;
        console.log(currPid);

        if (page > 0) {  // if there are comments
            var title = document.createElement('div');
            title.innerHTML = `
                        <h2>Comments</h2><hr>`;
            container.append(title);

            // add comments
            comments.forEach(function (comment){
                var div = document.createElement('div');
                div.className = "comment";
                div.id = "cmt" + comment.id;
                div.innerHTML = `
                        <div>
                            <div><b>${comment.author}</b>: ${comment.content}</div>
                            <div>posted on ${comment.time}</div>
                        </div>`;
                //delete button
                var deleteCmt = document.createElement('div');
                deleteCmt.className = "delete_comment";
                deleteCmt.onclick = function(e) {
                    e.preventDefault();
                    var currCid = comment.id;
                    var data = {'currPid': currPid, 'currCid': currCid, 'page': page};
                    document.dispatchEvent(new CustomEvent('deleteCmtClicked',{'detail': data}));
                };
                div.append(deleteCmt);
                container.append(div);
                var line = document.createElement('div');
                line.innerHTML = '<hr>';
                container.append(line);
            });

            // page buttons
            var paging = document.createElement('div');
            paging.className = "comment_paging";
            var changePage1 = document.createElement('div');
            changePage1.className = "change_page";
            var toFirstPage = document.createElement('div');
            toFirstPage.id = "to_first_page";
            toFirstPage.innerHTML = "<<";
            toFirstPage.onclick = function(e) {
                e.preventDefault();
                console.log('first');
                var data = {'currPid': currPid, 'page': page, 'change': "first"};
                document.dispatchEvent(new CustomEvent('PageChangeClicked', {'detail': data}));
            };
            var toPrevPage = document.createElement('div');
            toPrevPage.id = "to_prev_page";
            toPrevPage.innerHTML = "<";
            toPrevPage.onclick = function(e) {
                e.preventDefault();
                console.log('prev');
                var data = {'currPid': currPid, 'page': page, 'change': "prev"};
                document.dispatchEvent(new CustomEvent('PageChangeClicked', {'detail': data}));
            };
            var changePage2 = document.createElement('div');
            changePage2.className = "change_page"
            var toLastPage = document.createElement('div');
            toLastPage.id = "to_last_page";
            toLastPage.innerHTML = ">>";
            toLastPage.onclick = function(e) {
                e.preventDefault();
                console.log('last');
                var data = {'currPid': currPid, 'page': page, 'change': "last"};
                document.dispatchEvent(new CustomEvent('PageChangeClicked', {'detail': data}));
            };
            var toNextPage = document.createElement('div');
            toNextPage.id = "to_next_page";
            toNextPage.innerHTML = ">";
            toNextPage.onclick = function(e) {
                e.preventDefault();
                console.log('next');
                var data = {'currPid': currPid, 'page': page, 'change': "next"};
                document.dispatchEvent(new CustomEvent('PageChangeClicked', {'detail': data}));
            };
            var pageDiv = document.createElement('div');
            pageDiv.innerHTML = `page ${page}`;

            changePage1.append(toFirstPage);
            changePage1.append(toPrevPage);
            changePage2.append(toNextPage);
            changePage2.append(toLastPage);
            paging.append(changePage1);
            paging.append(pageDiv);
            paging.append(changePage2);
            container.append(paging);
        } else {
            var title = document.createElement('div');
            title.innerHTML = `
                    <div><h2>Comments</h2></div>
                    <div><hr></div>
                    <div>No comments yet, be the first one to comment!</div>`;
            container.append(title);
        }

    };

    return view;
    
}());
