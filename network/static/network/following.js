document.addEventListener('DOMContentLoaded', function() {
    console.log("JavaScript is loaded and ready!");

    
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

  
    document.querySelector('#showAllPostsLink')?.addEventListener('click', function(event) {
        window.location.href = "{% url 'index' %}";  // Navigate to the "All Posts" page
    });

    document.querySelector('#showFollowingLink')?.addEventListener('click', function(event) {
        window.location.href = "{% url 'following' %}";  // Navigate to the "Following" page
    });

    document.querySelector('#showNewPostLink')?.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent default link behavior (for dynamic form toggle)
        
        toggleView('new');       // Show New Post Form
    });
    
    toggleView('all');
});
