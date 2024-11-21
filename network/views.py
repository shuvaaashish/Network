from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator

from .models import User,Post,Follow


def index(request):
    if request.method == "POST":
        author = request.user
        content=request.POST["content"]
        post = Post(author=author, content=content)
        post.save()
    posts = Post.objects.all().order_by("-created_at")
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
    user = User.objects.get(pk=uid)
    follower =Follow.objects.filter(user=user).count()
    following = Follow.objects.filter(following=user).count()
    posts = Post.objects.filter(author=user).order_by("-created_at")
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
