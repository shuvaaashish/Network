document.addEventListener('DOMContentLoaded', function() {
    console.log("JavaScript is loaded and ready!");

    // Event listeners
    document.querySelector('#showFollowingLink')?.addEventListener('click', handleFollowingLinkClick);
    document.querySelector('#showNewPostLink')?.addEventListener('click', handleNewPostLinkClick);
    document.querySelectorAll('.favorite-btn').forEach(button => button.addEventListener('click', handleFavoriteButtonClick));
    document.querySelectorAll('.edit-btn').forEach(button => button.addEventListener('click', handleEditButtonClick));
    document.querySelectorAll('.cancel-btn').forEach(button => button.addEventListener('click', handleCancelButtonClick));
    document.querySelectorAll('.edit-form').forEach(form => form.addEventListener('submit', handleEditFormSubmit));
    toggleView('all');

    // Function to toggle between showing all posts and the new post form
    function toggleView(view) {
        const allPosts = document.querySelector('#all-posts');
        const newPostForm = document.querySelector('#new-post');
        
        if (view === 'all') {
            allPosts.style.display = 'block';
            newPostForm.style.display = 'none';
        } else {
            allPosts.style.display = 'block';
            newPostForm.style.display = 'block';
        }
    }

    // Function to handle the "Following" link click
    function handleFollowingLinkClick(event) {
        event.preventDefault();  // Prevent default link behavior
        window.location.href = followingUrl;  // Navigate to the "Following" page
    }

    // Function to handle the "Create New Post" link click
    function handleNewPostLinkClick(event) {
        event.preventDefault();
        toggleView('new');  // Show the New Post Form if already on the All Posts page
    }

    // Function to handle the favorite button click
    function handleFavoriteButtonClick() {
        const postId = this.dataset.postId;
        const icon = this.querySelector('.material-symbols-outlined');
        
        likePost(postId).then(data => {
            const likeCount = document.querySelector(`#like-count-${postId}`);
            if (likeCount) {
                likeCount.textContent = data.like_count;
            }
            if (icon) {
                if (data.is_liked) {
                    icon.classList.add('liked');
                } else {
                    icon.classList.remove('liked');
                }
            }
        });
    }

    // Function to like a post
    function likePost(postId) {
        return fetch(`/post/${postId}/like/`)
            .then(response => response.json());
    }

    // Function to handle the edit button click
    function handleEditButtonClick() {
        const cardBody = this.closest('.card-body');
        const editForm = cardBody.querySelector('.edit-form');
        const content = cardBody.querySelector('.card-text');

        content.style.display = 'none';
        editForm.style.display = 'block';
    }

    // Function to handle the cancel button click
    function handleCancelButtonClick() {
        const cardBody = this.closest('.card-body');
        const editForm = cardBody.querySelector('.edit-form');
        const content = cardBody.querySelector('.card-text');

        content.style.display = 'block';
        editForm.style.display = 'none';
    }

    // Function to handle the edit form submission
    function handleEditFormSubmit(event) {
        event.preventDefault();

        const cardBody = this.closest('.card-body');
        const content = cardBody.querySelector('.card-text');
        const editContent = this.querySelector('.edit-content').value;

        // Update the content on the page
        content.textContent = editContent;
        content.style.display = 'block';
        this.style.display = 'none';

        // Submit the form
        this.submit();
    }
});
