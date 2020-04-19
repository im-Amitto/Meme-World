import redis
import time
import uuid
import math
import string
import random
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib
import os
import socketio
from flask import Flask, request, abort, jsonify, send_from_directory

redis_host = "localhost"
redis_port = 6379
redis_password = ""

conn = redis.StrictRedis(host=redis_host, port=redis_port,
                         password=redis_password, decode_responses=True)

HOME_TIMELINE_SIZE = 1000
POSTS_PER_PASS = 1000


def randomString(N=10):
    return str(''.join(random.choices(string.ascii_uppercase +
                                      string.digits, k=N)))


def acquire_lock_with_timeout(
        lockname, acquire_timeout=10, lock_timeout=10):
    identifier = str(uuid.uuid4())
    lock_timeout = int(math.ceil(lock_timeout))

    end = time.time() + acquire_timeout
    while time.time() < end:
        if conn.setnx(lockname, identifier):
            conn.expire(lockname, lock_timeout)
            return identifier
        elif not conn.ttl(lockname):
            conn.expire(lockname, lock_timeout)
        time.sleep(.001)
    return False


def release_lock(lockname, identifier):
    pipe = conn.pipeline(True)
    lockname = 'lock:' + lockname
    while True:
        try:
            pipe.watch(lockname)
            if pipe.get(lockname) == identifier:
                pipe.multi()
                pipe.delete(lockname)
                pipe.execute()
                return True
            pipe.unwatch()
            break
        except redis.exceptions.WatchError:
            pass
    return False


def create_user(login, name):
    llogin = login.lower()
    lock = acquire_lock_with_timeout('user:' + llogin, 1)

    if not lock:
        return None

    if conn.hget('users:', llogin):
        return None

    id = conn.incr('user:id:')

    pipeline = conn.pipeline(True)
    pipeline.hset('users:', llogin, id)

    pipeline.hmset('user:%s' % id, {
        'login': login,
        'id': id,
        'name': name,
        'followers': 0,
        'following': 0,
        'posts': 0,
        'signup': time.time(),

    })
    pipeline.execute()
    release_lock('user:' + llogin, lock)

    return id


def create_status(uid, message):
    pipeline = conn.pipeline(True)
    pipeline.hget('user:%s' % uid, 'login')
    pipeline.incr('status:id:')
    login, id = pipeline.execute()

    if not login:
        return None
    data = {}
    data.update({
        'message': message,
        'posted': time.time(),
        'id': id,
        'uid': uid,
        'login': login,
    })
    pipeline.hmset('status:%s' % id, data)
    pipeline.hincrby('user:%s' % uid, 'posts')

    pipeline.execute()
    return id


def get_status_messages(uid, timeline='home:', page=1, count=30):
    statuses = conn.zrevrange(
        '%s%s' % (timeline, uid), (page-1)*count, page*count-1)

    pipeline = conn.pipeline(True)
    for id in statuses:
        pipeline.hgetall('status:%s' % id)

    return filter(None, pipeline.execute())


def follow_user(uid, other_uid):
    fkey1 = 'following:%s' % uid
    fkey2 = 'followers:%s' % other_uid

    if conn.zscore(fkey1, other_uid):
        return None

    now = time.time()
    pipeline = conn.pipeline(True)
    pipeline.zadd(fkey1, other_uid, now)
    pipeline.zadd(fkey2, uid, now)

    pipeline.zcard(fkey1)
    pipeline.zcard(fkey2)

    pipeline.zrevrange('profile:%s' % other_uid,
                       0, HOME_TIMELINE_SIZE-1, withscores=True)

    following, followers, status_and_score = pipeline.execute()[-3:]
    pipeline.hset('user:%s' % uid, 'following', following)
    pipeline.hset('user:%s' % other_uid, 'followers', followers)

    if status_and_score:
        pipeline.zadd('home:%s' % uid, **dict(status_and_score))
    pipeline.zremrangebyrank('home:%s' % uid, 0, -HOME_TIMELINE_SIZE-1)

    pipeline.execute()
    return True


def unfollow_user(uid, other_uid):
    fkey1 = 'following:%s' % uid
    fkey2 = 'followers:%s' % other_uid

    if not conn.zscore(fkey1, other_uid):
        return None

    pipeline = conn.pipeline(True)
    pipeline.zrem(fkey1, other_uid)
    pipeline.zrem(fkey2, uid)

    pipeline.zcard(fkey1)
    pipeline.zcard(fkey2)

    pipeline.zrevrange('profile:%s' % other_uid,
                       0, HOME_TIMELINE_SIZE-1)

    following, followers, statuses = pipeline.execute()[-3:]
    pipeline.hset('user:%s' % uid, 'following', following)
    pipeline.hset('user:%s' % other_uid, 'followers', followers)

    if statuses:
        pipeline.zrem('home:%s' % uid, *statuses)

    pipeline.execute()
    return True


def syndicate_status(uid, post, start=0):
    followers = conn.zrangebyscore('followers:%s' % uid, start, 'inf',
                                   start=0, num=POSTS_PER_PASS, withscores=True)

    pipeline = conn.pipeline(False)
    for follower, start in followers:

        pipeline.zadd('home:%s' % follower, **post)
        pipeline.zremrangebyrank(
            'home:%s' % follower, 0, -HOME_TIMELINE_SIZE-1)

    pipeline.execute()


def post_status(uid, message):
    id = create_status(uid, message)
    if not id:
        return None

    posted = conn.hget('status:%s' % id, 'posted')

    if not posted:
        return None

    post = {str(id): float(posted)}
    conn.zadd('profile:%s' % uid, **post)

    syndicate_status(uid, post)

    return id


def delete_status(uid, status_id):
    key = 'status:%s' % status_id
    lock = acquire_lock_with_timeout(key, 1)
    if not lock:
        return None

    if conn.hget(key, 'uid') != str(uid):
        return None

    pipeline = conn.pipeline(True)
    status = conn.hgetall(key)

    status['deleted'] = True

    pipeline.delete(key)
    pipeline.zrem('profile:%s' % uid, status_id)
    pipeline.zrem('home:%s' % uid, status_id)
    pipeline.hincrby('user:%s' % uid, 'posts', -1)
    pipeline.execute()

    release_lock(key, lock)
    return True


def getFollowersList(uid):
    temp = []
    followers = conn.zrangebyscore('followers:%s' % uid, 0, 'inf',
                                   start=0, num=1000, withscores=True)
    for follower in followers:
        login = conn.hget('user:%s' % int(follower[1]), 'login')
        temp.append({'name': login, 'id': int(follower[1])})
    return temp


def getFollowingList(uid):
    temp = []
    followers = conn.zrangebyscore('following:%s' % uid, 0, 'inf',
                                   start=0, num=1000, withscores=True)
    for follower in followers:
        login = conn.hget('user:%s' % int(follower[1]), 'login')
        temp.append({'name': login, 'id': int(follower[1])})
    return temp


app = Flask(__name__)


@app.route('/api/user', methods=['POST'])
def create_user_api():
    print(request.data)
    user = json.loads(request.data)
    if not 'name' in user:
        abort(400)

    loginId = randomString()
    id = create_user(loginId, user['name'])
    return jsonify({'name': user['name'], 'logindId': loginId, 'userId': id}), 200


@app.route('/api/post', methods=['POST'])
def create_post():
    post = json.loads(request.data)
    post_status(post['userId'], post['message'])
    return jsonify({'message': 'Posted Successfully'}), 200


@app.route('/api/status', methods=['GET'])
def get_status():
    id = request.args.get('id')
    msg = get_status_messages(id, 'profile:')
    return jsonify(list(msg)), 200


@app.route('/api/home', methods=['GET'])
def get_home():
    id = request.args.get('id')
    msg = get_status_messages(id)
    return jsonify(list(msg)), 200


@app.route('/api/followers', methods=['GET'])
def get_follower():
    id = request.args.get('id')
    msg = getFollowersList(id)
    return jsonify(msg), 200


@app.route('/api/following', methods=['GET'])
def get_following():
    id = request.args.get('id')
    msg = getFollowingList(id)
    return jsonify(msg), 200


@app.route('/api/follow', methods=['POST'])
def follow():
    post = json.loads(request.data)
    follow_user(post['uId'], post['uId2'])
    return jsonify({'message': 'Updated successfully'}), 200


@app.route('/api/unfollow', methods=['POST'])
def unfollow():
    post = json.loads(request.data)
    unfollow_user(post['uId'], post['uId2'])
    unfollow_user(post['uId2'], post['uId'])
    return jsonify({'message': 'Updated successfully'}), 200

@app.route('/static/js/<path:filename>')
def serve_js(filename):
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir, 'build', 'static', 'js'), filename)

@app.route('/static/css/<path:filename>')
def serve_css(filename):
    root_dir = os.path.dirname(os.getcwd())
    print(root_dir)
    return send_from_directory(os.path.join(root_dir, 'build', 'static', 'css'), filename)

@app.route('/')
def serve_static():
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir, 'build'), 'index.html')



if __name__ == '__main__':
    app.run(debug=True)
