import os
import json


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

def dump(x, y):
    dataset = {
        "x": x,
        "y": y
    }
    with open("joined_dataset.json", "w") as f:
        json.dump(dataset, f)

if __name__ == '__main__':
    x, y = create_x_y()
    dump(x, y)
