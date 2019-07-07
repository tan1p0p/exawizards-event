import json
import random

def main():
    id_num = 736
    ids = [input() for _ in range(id_num)]

    groups = {}
    for i, group_id in enumerate(list(set([id[2:4] for id in ids]))):
        groups[group_id] = i

    nodes, links = [], []
    for i in range(id_num):
        id = ids[i]
        co_workers = ids[:i] + ids[i+1:]

        same_dep = [i for i in co_workers if i[2:4] == id[2:4]]
        for _ in range(random.randint(5, 10)):
            co_workers += same_dep

        same_year = [i for i in co_workers if i[:2] == id[:2]]
        for _ in range(random.randint(5, 10)):
            co_workers += same_year


        link_num = random.randint(50, 100)
        friends = random.choices(co_workers, k=link_num)


        friends_uniq = list(set(friends))
        for friend_id in friends_uniq:
            friends_num = friends.count(friend_id)
            if friends_num >= 3:
                links.append({"source": id, "target": friend_id, "value": friends_num})

        nodes.append({
            "id": id,
            "group": groups[id[2:4]]
        })

    data = {
        "nodes": nodes,
        "links": links,
    }

    json_text = 'data=' + json.dumps(data)
    fw = open('data.js', 'w')
    fw.write(json_text)


if __name__ == "__main__":
    main()
