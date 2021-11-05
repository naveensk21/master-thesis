import ast
import csv
import os
import json
from dataclasses import dataclass
from typing import List

LABELS_TO_REMOVE = {
    "The text introduces the policy, a section, or a group of practices, but it does not mention a specific practice.",
    'The text describes how to contact the company with questions, concerns, or complaints about the privacy policy.',
    'The text describes a specific data practice that is not covered by our label scheme.',
    'The policy makes generic security statements, e.g., "we protect your data" or "we use technology/encryption to protect your data".',
    'The text does not fit into our label scheme.',
    'The policy makes a statement about how data from children is treated.',
    "When a change of an unspecified nature is made to the privacy policy, the policy date is updated or information about the change is posted as part of the policy. Users' choices regarding policy changes are not mentioned or are unclear.",
    'A user can edit their information, within the scope of information explicitly provided by the user.',
    'A specific security measure not covered above.',
    'Users with accounts can edit their information, within the scope of information explicitly provided by the user.',
    'The policy makes a statement about how data from Californian users is treated (e.g., California privacy rights).',
}

VALID_LABELS = {
    'Data is accessible to employees/third parties on a need-to-know basis.',
    'The site collects your unspecified information for analytics or research. Collection happens in an unspecified way.',
    'The policy makes specific provisions for international audiences, non-US citizens, or non-European citizens (e.g., about international data transfer).',
    'Data transfer between user and website/app is encrypted, e.g., SSL, TLS, HTTPS.',
    'A user can edit their information, within the scope of unspecified user information.',
    'The site collects your unspecified information for a basic service or feature. Collection happens in an unspecified way.',
    'The company/organization has a privacy or security program/organization in place addressing, for example, how to protect data against unauthorized access or privacy training for employees.',
    'The site collects your cookies or tracking elements for analytics or research. Collection happens on the website.',
    'Data is stored securely, e.g. in an encrypted format or database.',
    'The site collects your IP address or device IDs for an unspecified purpose. Collection happens when you implicitly provide information on the website.',
}
UNIQUIFIED = "dataset/pretty_print_uniquified"

def main():
    labels_filter_out = False
    unique_labels = set()

    file_name_to_datapoints = {}
    for file_name in os.listdir(UNIQUIFIED):
        # print(file_name)
        datapoints_from_file: list[Datapoint] = load_labels_from_csv(file_name)
        # if labels_filter_out:
        #     datapoints_from_file = [datapoint for datapoint in datapoints_from_file if datapoint.label not in LABELS_TO_REMOVE]
        # else:
        #     datapoints_from_file = [datapoint for datapoint in datapoints_from_file if datapoint.label in VALID_LABELS]
        if datapoints_from_file:
            policy_name = datapoints_from_file[0].policy_name
            file_name_to_datapoints[policy_name] = datapoints_from_file
            unique_labels.update([p.label for p in datapoints_from_file])

    # for label in unique_labels:
    #     print(label)

    print(f"Total unique labels: {len(unique_labels)}")
    total_labels = 0
    for file_name, datapoints_of_file in file_name_to_datapoints.items():
        total_labels += len(datapoints_of_file)
    labels_frequency = {}
    for file_name, datapoints_of_file in file_name_to_datapoints.items():
        for dp in datapoints_of_file:
            if dp.label not in labels_frequency:
                labels_frequency[dp.label] = 0
            labels_frequency[dp.label] += 1
    print(f"Total labels: {total_labels}")
    print(f"Total policies: {len(file_name_to_datapoints)}")
    total_policies_with_labels = 0
    for file_name, labels in file_name_to_datapoints.items():
        if len(labels) != 0:
            total_policies_with_labels += 1
    print(f"Total policies with labels: {total_policies_with_labels}")

    print("Labels frequencies:")
    frequency = tuple(labels_frequency.items())
    for entry in sorted(frequency, key=lambda x: x[1], reverse=True)[:10]:
        print(f"'{entry[0]}' is found {entry[1]} times in the dataset")

    print("Labels count per policy:")
    for entry in sorted(file_name_to_datapoints.items(), key=lambda x: len(x[1]), reverse=True):
        # print(f"'{entry[0]}',")
        print(f"Policy '{entry[0]}' has {len(entry[1])} labels")

    dataset = []
    all_collected_datapoints = []
    for datapoints in file_name_to_datapoints.values():
        for datapoint in datapoints:
            datapoint.policy_text = load_policy_segment(datapoint.policy_name, datapoint.segment_number)
            all_collected_datapoints.append(datapoint)

    for dp in all_collected_datapoints:
        dataset.append(
            {
                "policy_name": dp.policy_name,
                "policy_text": dp.policy_text,
                "segment_number": dp.segment_number,
                "label": dp.label,
            }
        )

    clean_dataset_file_path = "segments.json"
    with open(clean_dataset_file_path, "w") as f:
        json.dump(dataset, f)
    print(f"Written the dataset into {clean_dataset_file_path}")

def load_plocy_by_name(name) -> str:
    policy_dir = "dataset/sanitized_policies"

    policy_filenames = os.listdir(policy_dir)
    for file_name in policy_filenames:
        if name in file_name:
            policy_path = f"{policy_dir}/{file_name}"
            with open(policy_path) as f:
                return f.read()

    raise Exception(f"Did not find policy {name}")

def load_policy_segment(policy_name, segment_idx):
    policy_text = load_plocy_by_name(policy_name)
    return policy_text.split("|||")[segment_idx]

@dataclass
class Datapoint:
    policy_name: str
    label: str
    segment_number: int
    policy_text:str = None


def load_labels_from_csv(filename) -> List[Datapoint]:
    points = []
    policy_name = policy_name_from_csv_name(filename)
    path = f"{UNIQUIFIED}/{filename}"
    with open(path, newline="") as file:
        reader = csv.reader(file, delimiter=",")
        for row in reader:
            lbl, _, raw_segments = row
            marks = list(ast.literal_eval(raw_segments))
            segment_indexes = set([mark[1] for mark in marks])
            datapoints = [Datapoint(policy_name, lbl, segment_idx) for segment_idx in segment_indexes]
            points.extend(datapoints)
    return points

def policy_name_from_csv_name(csv_name:str):
    return csv_name[:-4]

if __name__ == '__main__':
    main()
