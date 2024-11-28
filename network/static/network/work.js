document.addEventListener('DOMContentLoaded', function() {
    console.log("JavaScript is loaded and ready!");

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

    // When "Following" link is clicked
    document.querySelector('#showFollowingLink')?.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent default link behavior
        window.location.href = followingUrl;  // Navigate to the "Following" page
    });

    // When "Create New Post" is clicked
    document.querySelector('#showNewPostLink')?.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent default link behavior (for dynamic form toggle)
        toggleView('new');       // Show the New Post Form if already on the All Posts page
    });

    // Favorite functionality
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.dataset.postId;
            likePost(postId);
            const icon = this.querySelector('.material-symbols-outlined');
            icon.classList.toggle('liked');
        });
    });

    function likePost(postId) {
        fetch(`/post/${postId}/like/`)
        .then(response => response.json())
        .then(data => {
            const likeCount = document.querySelector(`#like-count-${postId}`);
            if (likeCount) {
                likeCount.textContent = data.like_count;
            }
        });
    }

    // Edit functionality
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const cardBody = this.closest('.card-body');
            const editForm = cardBody.querySelector('.edit-form');
            const content = cardBody.querySelector('.card-text');

            content.style.display = 'none';
            editForm.style.display = 'block';
        });
    });

    document.querySelectorAll('.cancel-btn').forEach(button => {
        button.addEventListener('click', function() {
            const cardBody = this.closest('.card-body');
            const editForm = cardBody.querySelector('.edit-form');
            const content = cardBody.querySelector('.card-text');

            content.style.display = 'block';
            editForm.style.display = 'none';
        });
    });

    document.querySelectorAll('.edit-form').forEach(form => {
        form.addEventListener('submit', function(event) {
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
        });
    });

    // Initialize the page by showing All Posts section by default
    toggleView('all');
});
