from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required

from .models import User,Post,Follow,Like


def index(request):
    if request.method == "POST":
        author = request.user
        content=request.POST["content"]
        post = Post(author=author, content=content)
        post.save()
        return HttpResponseRedirect(reverse("index"))
    else:
        posts = Post.objects.all().order_by("-created_at")
        for post in posts:
            if request.user.is_authenticated:
                post.is_liked_by_user = post.post_likes.filter(user=request.user).exists()
            else:
                post.is_liked_by_user = False
        paginator = Paginator(posts, 10)
        pageNumber = request.GET.get('page')
        pages= paginator.get_page(pageNumber)
        return render(request, "network/index.html",{
        "posts":posts,
        "pages":pages
        })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    
def profile(request, uid):
        if request.method == "POST":
            author = request.user
            content=request.POST["content"]
            post = Post(author=author, content=content)
            post.save()
            return HttpResponseRedirect(reverse("index"))
        else:
            user = User.objects.get(pk=uid)
            follower =Follow.objects.filter(user=user)
            following = Follow.objects.filter(following=user).count()
            posts = Post.objects.filter(author=user).order_by("-created_at")
            for post in posts:
                if request.user.is_authenticated:
                    post.is_liked_by_user = post.post_likes.filter(user=request.user).exists()
                else:
                    post.is_liked_by_user = False
            paginator = Paginator(posts, 10)
            pageNumber = request.GET.get('page')
            pages= paginator.get_page(pageNumber)
            return render(request, "network/profile.html",{
            "user":user,
            "posts":posts,
            "pages":pages,
            "follower":follower,
            "following":following,
        })

def following(request):
    if request.method == "POST":
        author = request.user
        content=request.POST["content"]
        post = Post(author=author, content=content)
        post.save()
        return HttpResponseRedirect(reverse("index"))
    else:
        user = request.user
        following = Follow.objects.filter(user=user)
        posts = Post.objects.filter(author__in=[f.following for f in following]).order_by("-created_at")
        for post in posts:
            if request.user.is_authenticated:
                post.is_liked_by_user = post.post_likes.filter(user=request.user).exists()
            else:
                post.is_liked_by_user = False
        paginator = Paginator(posts, 10)
        pageNumber = request.GET.get('page')
        pages= paginator.get_page(pageNumber)
        return render(request, "network/index.html",{
            "posts":posts,
            "pages":pages
    })
def edit(request, pid):
    post = Post.objects.get(id=pid, author=request.user)
    if request.method == 'POST':
        content = request.POST.get('content', '')
        post.content = content
        post.save()
        return HttpResponseRedirect(reverse('index'))
    
    return render(request, 'network/edit_post.html', {'post': post})

@login_required
def toggle_follow(request, uid):
    target_user = User.objects.get(id=uid)
    follow = Follow.objects.filter(user=request.user, following=target_user).first()
    
    if follow:
        follow.delete()
    else:
        Follow.objects.create(user=request.user, following=target_user)
    return HttpResponseRedirect(reverse('profile', args=[uid]))

def toggle_like(request, pid):
    post = Post.objects.get(id=pid)
    user = request.user
    existing_like = Like.objects.filter(user=user, post=post)

    if existing_like.exists():
        existing_like.delete() 
    else:
        Like.objects.create(user=user, post=post)  
    like_count = post.post_likes.count()

    return JsonResponse({
        'like_count': like_count
    })