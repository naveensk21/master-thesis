import os
import json
import random
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

    random.shuffle(dataset_json)
    for datapoint in dataset_json:
        x.append(datapoint["policy_text"])
        y.append(datapoint["label"])

    print(f"Loaded {len(x)} policies with {len(y)} corresponding sets of policy particles ")
    return x, y

def train(x, y, val_x, val_y):
    processor = ClassificationProcessor(multi_label=True)
    embed = BareEmbedding(processor=processor)

    model = BiLSTM_Model(embed)

    # data_train, data_test, labels_train, labels_test = train_test_split(x, y, test_size=0.20, random_state=42)
    model.fit(x, y, val_x, val_y)

if __name__ == '__main__':
    x, y = create_x_y()
    with open("joined_dataset.json") as f:
        dataset = json.load(f)

    val_x, val_y = dataset["x"], dataset["y"]
    train(x[:30], y[:30], val_x, val_y)
