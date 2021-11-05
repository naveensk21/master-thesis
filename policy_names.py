import os
import json


if __name__ == '__main__':
    policy_dir = "dataset/sanitized_policies"
    with open("policy_names.json", "w") as f:
        f.write(json.dumps(list(os.listdir(policy_dir))))