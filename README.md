# Meme World

## Introduction 
This application use redis as database.
The functionalities that it has are
- A new user is created whenever the page is rendered
- A user can post meme that can be seen on profile page
- A user can follow someone so they can see their meme on home page
- A user can unfollow anyone if they want
- Mainly it uses the ordered_set and map from redis


## Deployment
### Prerequisite

- Python3
- redis < 3.0

### How to run?

```
  cd app
  python3 redis-test.py
```

You can see your application at `htttp://localhost:{port-number}/` by default it's `5000`.

### Postman collection

Postman collection can be found at `postman/MemeWorld.postman_collection.json`

### App demonstration
Link: [Link to the video](https://www.loom.com/share/f733bdc539a24b82a90f435fc22fda3b)

<video width="320" height="240" controls>
  <source src="https://www.loom.com/share/f733bdc539a24b82a90f435fc22fda3b" type="video/mp4">
</video>

### Report Q/A

## Improvements that can be done
- For people with large followers we can use queue and workers
- For the page who get lots of traffic, we can create a static cache for them
- We can use pub/sub to trigger notification

## Why use python and react
- React because of familiarity as i don't wanna waste much time on front-end
- Python because i got bored of node.js so i thought of using python for the firs time as web server

## Data structures
Mainly i used hash and ordered_set
- Ordered_set helped to order all followers/unfollowers and posts activity in the manner i wanted them to displayed so saved my a lot of operation
- hash for user and for other object types because they are the perfect way to represent an object as a Redis data structure. Also, they provide constant time basic operations like get, set, exists etc.

## Multi-threaded support
It have concurrency but not parallelism
It's a API based application where more than 100 users can be active at the same time thus it's a multi threading application amd this is the reason i used locks wherever necessary.