import os
import json
from kashgari.tasks.classification import BiLSTM_Model
from kashgari.processors import ClassificationProcessor
from kashgari.embeddings import BareEmbedding
import logging

from sklearn.model_selection import train_test_split

logging.basicConfig(level='DEBUG')

def create_x_y():
    clean_dataset_file_path = "segments.json"

    with open(clean_dataset_file_path) as f:
        dataset_json = json.load(f)

    x = []
    y = []
    import random
    random.shuffle(dataset_json)
    for datapoint in dataset_json:
        x.append(datapoint["policy_text"])
        y.append(datapoint["label"])

    print(f"Loaded {len(x)} policies with {len(y)} corresponding sets of policy particles ")
    return x, y

def train(x, y):
    processor = ClassificationProcessor(multi_label=True)
    embed = BareEmbedding(processor=processor)

    model = BiLSTM_Model(embed)

    data_train, data_test, labels_train, labels_test = train_test_split(x, y, test_size=0.20, random_state=42)
    model.fit(data_train, labels_train, data_test, labels_test)

if __name__ == '__main__':
    x, y = create_x_y()
    train(x, y)
