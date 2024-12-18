import argparse
import json
import os


def list_file_paths(path):
    file_paths = []
    for root, dirs, files in os.walk(path):
        # 除外ディレクトリを追加
        exclude_dirs = {"node_modules", "build", "i18n", ".git"}
        dirs[:] = [d for d in dirs if d not in exclude_dirs]

        # ファイルフィルタ
        for file in files:
            file_path = os.path.join(root, file)
            # テキストファイルのみを対象にする
            if file_path.endswith((".txt", ".md", ".html", ".js", ".ts", ".json", ".go")):
                file_paths.append(file_path)

    return file_paths



def replace_keys_in_repository(repo_path, json_file_path):
    with open(json_file_path, 'r', encoding="utf-8") as json_file:
        key_value_pairs = json.load(json_file)

    pairs = []
    for key, value in key_value_pairs.items():
        pairs.append((key, value))
    pairs.sort(key=lambda x: len(x[0]), reverse=True)

    files = list_file_paths(repo_path)
    print('Total files: {}'.format(len(files)))
    for file_path in files:
        replace_keys_in_file(file_path, pairs)


def replace_keys_in_file(file_path, pairs):
    try:
        with open(file_path, 'r', encoding="utf-8") as file:
            content = file.read()

        for key, value in pairs:
            content = content.replace(key, value)

        with open(file_path, 'w', encoding="utf-8") as file:
            file.write(content)
    except UnicodeDecodeError:
        print('UnicodeDecodeError: {}'.format(file_path))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Replace keys in repository.')
    parser.add_argument('--repository_path', help='Path to repository')
    parser.add_argument('--json_file_path', help='Path to JSON file')
    args = parser.parse_args()
    replace_keys_in_repository(args.repository_path, args.json_file_path)
