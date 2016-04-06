import numpy as np
import lda
import json

with open('../crawler/data/games_tagged.json') as games_data_file:
    games = json.load(games_data_file)
with open('../crawler/data/tags.json') as tags_data_file:
    tags = json.load(tags_data_file)

# map tag ids to their respective index in the matrix
tag_id_map = {}
tag_names = []
count_tags = 0
for tag in tags:
    tag_id_map[tag['tagid']] = count_tags
    count_tags += 1
    tag_names.append(tag['name'])

# build document term matrix
matrix = np.zeros((len(games), len(tags)), dtype=np.int64)

for index, game in enumerate(games):
    for tag in game['tags']:
        matrix[index][tag_id_map[tag]] = 1

model = lda.LDA(n_topics=40, n_iter=100, random_state=1)
model.fit(matrix)

topic_word = model.topic_word_
n_top_words = 10
tag_topic_map = {} # maps each tag to a topic
for i, topic_dist in enumerate(topic_word):

    sorted_tag_index =  np.argsort(topic_dist)[::-1]
    for n in range(0, n_top_words):
        tag_index = sorted_tag_index[n]
        tag_id = tags[tag_index]['tagid']
        if tag_id in tag_topic_map:
            tag_topic_map[tag_id].append(i)
        else:
            tag_topic_map[tag_id] = [i]

    topic_words = np.array(tag_names)[np.argsort(topic_dist)][:-(n_top_words+1):-1]
    print('Topic {}: {}'.format(i, ' '.join(topic_words)))

# give tags without topic their own topic
topic_count = n_top_words
for tag in tags:
    if not tag['tagid'] in tag_topic_map:
        tag_topic_map[tag['tagid']] = [topic_count]
        topic_count += 1

with open('tags_topics.json', 'w') as output_file:
    json.dump(tag_topic_map, output_file)
