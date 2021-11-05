import csv
import os
import json

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


def main():
    labels_filter_out = False
    unique_labels = set()
    uniquified = "dataset/pretty_print_uniquified"
    file_name_to_labels = {}
    for file_name in os.listdir(uniquified):
        # print(file_name)
        labels_of_file = first_column_of_csv(f"{uniquified}/{file_name}")
        if labels_filter_out:
            labels_of_file = [l for l in labels_of_file if l not in LABELS_TO_REMOVE]
        else:
            labels_of_file = [l for l in labels_of_file if l in VALID_LABELS]
        if labels_of_file:
            sanitized_policy_name = file_name.removesuffix(".csv")
            file_name_to_labels[sanitized_policy_name] = labels_of_file
            unique_labels.update(labels_of_file)

    # for label in unique_labels:
    #     print(label)

    print(f"Total unique labels: {len(unique_labels)}")
    total_labels = 0
    for file_name, labels_of_file in file_name_to_labels.items():
        total_labels += len(labels_of_file)
    labels_frequency = {}
    for file_name, labels_of_file in file_name_to_labels.items():
        for l in labels_of_file:
            if l not in labels_frequency:
                labels_frequency[l] = 0
            labels_frequency[l] += 1
    print(f"Total labels: {total_labels}")
    print(f"Total policies: {len(file_name_to_labels)}")
    total_policies_with_labels = 0
    for file_name, labels in file_name_to_labels.items():
        if len(labels) != 0:
            total_policies_with_labels += 1
    print(f"Total policies with labels: {total_policies_with_labels}")

    print("Labels frequencies:")
    frequency = tuple(labels_frequency.items())
    for entry in sorted(frequency, key=lambda x: x[1], reverse=True)[:10]:
        print(f"'{entry[0]}' is found {entry[1]} times in the dataset")

    print("Labels count per policy:")
    for entry in sorted(file_name_to_labels.items(), key=lambda x: len(x[1]), reverse=True):
        # print(f"'{entry[0]}',")
        print(f"Policy '{entry[0]}' has {len(entry[1])} labels")
    clean_dataset_file_path = "clean_dataset.json"
    with open(clean_dataset_file_path, "w") as f:
        f.write(json.dumps(file_name_to_labels))
    print(f"Written clean dataset into {clean_dataset_file_path}")

def first_column_of_csv(path) -> list[str]:
    values = []
    with open(path, newline="") as file:
        reader = csv.reader(file, delimiter=",")
        for row in reader:
            values.append(row[0])
    return values


if __name__ == '__main__':
    main()
