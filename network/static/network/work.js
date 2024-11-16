document.addEventListener('DOMContentLoaded', function() {
    console.log("JavaScript is loaded and ready!");

    // Function to show the All Posts section and hide New Post form
    function showAllPosts() {
        console.log("Showing All Posts");
        document.querySelector('#all-posts').style.display = 'block';  // Show all posts
        document.querySelector('#new-post').style.display = 'none';    // Hide new post form
    }

    // Function to show the New Post form and hide All Posts section
    function showNewPost() {
        console.log("Showing New Post Form");
        document.querySelector('#all-posts').style.display = 'none';   // Hide all posts
        document.querySelector('#new-post').style.display = 'block';   // Show new post form
    }

    // Get the "All Posts" link and add the event listener
    const showAllPostsLink = document.querySelector('#showAllPostsLink');
    if (showAllPostsLink) {
        showAllPostsLink.addEventListener('click', function(event) {
            event.preventDefault();  // Prevent default link behavior
            showAllPosts();          // Show the posts
        });
    }

    // Get the "Create New Post" link and add the event listener
    const showNewPostLink = document.querySelector('#showNewPostLink');
    if (showNewPostLink) {
        showNewPostLink.addEventListener('click', function(event) {
            event.preventDefault();  // Prevent default link behavior
            showNewPost();           // Show the new post form
        });
    }

    // Initialize the page by showing the All Posts section by default
    showAllPosts();
});
