import os
import json
from kashgari.tasks.classification import BiLSTM_Model
from kashgari.processors import ClassificationProcessor
from kashgari.embeddings import BareEmbedding
import logging
logging.basicConfig(level='DEBUG')



def create_x_y():
    clean_dataset_file_path = "clean_dataset.json"

    with open(clean_dataset_file_path) as f:
        dataset_json = json.load(f)

    x = []
    y = []

    for file_name, labels in dataset_json.items():
        x.append(load_plocy_by_name(file_name))
        y.append(labels)

    print(f"Loaded {len(x)} policies with {len(y)} corresponding sets of policy particles ")
    return x, y

def load_plocy_by_name(name) -> str:
    policy_dir = "dataset/sanitized_policies"

    policy_filenames = os.listdir(policy_dir)
    for file_name in policy_filenames:
        if name in file_name:
            policy_path = f"{policy_dir}/{file_name}"
            with open(policy_path) as f:
                return f.read()

    raise Exception(f"Did not find policy {name}")


def train(x, y):
    # logging.basicConfig(level='DEBUG')
    #
    # bert_embed = BertEmbedding('bert-embeddings-123')
    #
    # model = BiLSTM_Model(bert_embed, sequence_length=100, multi_label=True)
    # model.fit(x, y)
    processor = ClassificationProcessor(multi_label=True)
    embed = BareEmbedding(processor=processor)

    model = BiLSTM_Model(embed)
    model.fit(x, y)

if __name__ == '__main__':
    x, y = create_x_y()
    train(x, y)
