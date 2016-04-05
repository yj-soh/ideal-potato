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

model = lda.LDA(n_topics=20, n_iter=100, random_state=1)
model.fit(matrix)

topic_word = model.topic_word_
n_top_words = 10
all_topic_tags = []
for i, topic_dist in enumerate(topic_word):
    topic_tags = []
    sorted_tag_index =  np.argsort(topic_dist)[::-1]
    for n in range(0, n_top_words):
        tag_index = sorted_tag_index[n]
        topic_tags.append(tags[tag_index]['tagid'])

    all_topic_tags.append(topic_tags)

    topic_words = np.array(tag_names)[np.argsort(topic_dist)][:-(n_top_words+1):-1]
    print('Topic {}: {}'.format(i, ' '.join(topic_words)))

with open('topic_tags.json', 'w') as output_file:
    json.dump(all_topic_tags, output_file)
