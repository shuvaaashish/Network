document.addEventListener('DOMContentLoaded', function() {
    console.log("JavaScript is loaded and ready!");

    // Function to show the All Posts section and hide New Post form
    function toggleView(view) {
        const allPosts = document.querySelector('#all-posts');
        const newPostForm = document.querySelector('#new-post');
        
        if (view === 'all') {
            allPosts.style.display = 'block';
            newPostForm.style.display = 'none';
        } else {
            allPosts.style.display = 'none';
            newPostForm.style.display = 'block';
        }
    }

    // Event listeners for showing All Posts and New Post form
    document.querySelector('#showAllPostsLink')?.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent default link behavior
        toggleView('all');       // Show All Posts
    });

    document.querySelector('#showNewPostLink')?.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent default link behavior
        toggleView('new');       // Show New Post Form
    });

    // Initialize the page by showing All Posts section by default
    toggleView('all');
});
