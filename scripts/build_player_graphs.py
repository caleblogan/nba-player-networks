import twitter
import json
import random


def build_players_friends(api, players):
    """Generate a list of friends for each nba player."""
    player_ids = [p['user_id'] for p in players]
    friends = {}

    for player_id in player_ids:
        try:
            print(f'Getting player: {player_id} friends.')
            ids = api.GetFriendIDs(user_id=player_id)
            print('friend ids:', ids[:10])
            friends[player_id] = ids
        except Exception as e:
            print('error:', e)
            # print('Sleeping for 5 minutes...')
            # time.sleep(5*60+10)
        save_friends(friends)

    save_friends(friends)


def save_friends(friends):
    with open('friends.json', 'w') as fp:
        json.dump(friends, fp)


def build_players(api):
    """Generates a file with player basic info."""
    members = api.GetListMembers(slug='nba-players', owner_screen_name='TheNBPA')
    users = []
    for member in members:
        users.append({
            'user_id': member.id,
            'followers_count': member.followers_count,
            'friends_count': member.friends_count,
            'location': member.location,
            'name': member.name,
            'profile_img': member.profile_image_url,
            'screen_name': member.screen_name
        })
    with open('players.json', 'w') as fp:
        json.dump(users, fp)


def build_graph(friends, weights):
    """
    nodes is a list of {id => str, weight => int} objects
    links is a list of {source => str, target => str} objects
        - weight = incoming links from other players
    """
    nodes = []
    links = []
    i = 0
    for player_id, player_friends in friends.items():
        nodes.append({
            'id': player_id,
            'weight': weights[player_id]
        })
        for friend in player_friends:
            links.append({
                'source': player_id,
                'target': friend
            })

    with open('graph.json', 'w') as fp:
        json.dump({'nodes': nodes, 'links': links}, fp)


def build_pruned_friends(friends):
    """Gets rid of non nba friends"""
    for player_id, player_friends in friends.items():
        friends[player_id] = [str(f) for f in player_friends if str(f) in friends]

    return friends


def combine_friends_files(*fnames):
    friends = {}
    for fname in fnames:
        with open(fname, 'r') as fp:
            friends.update(json.load(fp))

    with open('friends_combined.json', 'w') as out_fp:
        json.dump(friends, out_fp)


def load_players(fname='players.json'):
    with open(fname, 'r') as fp:
        return json.load(fp)


def load_friends(fname='friends_combined.json'):
    with open(fname, 'r') as fp:
        return json.load(fp)


def count_followers(friends):
    """returns a map of player_id to follers"""
    followers = dict(zip(friends.keys(), [0] * len(friends)))
    for player, following in friends.items():
        for friend in following:
            followers[friend] += 1
    return followers


def get_player(players, user_id):
    for player in players:
        if player['user_id'] == int(user_id):
            return player


if __name__ == '__main__':
    api = twitter.Api(
        consumer_key='',
        consumer_secret='',
        access_token_key='',
        access_token_secret='',
        sleep_on_rate_limit=True
    )
    players = load_players()
    friends = build_pruned_friends(load_friends())
    weights = count_followers(friends)
    # for k, v in sorted(weights.items(), key=lambda x: x[1]):
    #     print(f'{v} - {get_player(players, k)["name"]}')

    # print(max(weights.items(), key=lambda x: x[1]))
    build_graph(friends, weights)

