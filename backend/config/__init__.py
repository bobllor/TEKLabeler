from pathlib import Path
import json
from keys import DEFAULT_KEYS

def check_keys(obj: dict, default: dict):
    for key in default:
        try:
            if obj[key] != default[key]:
                if isinstance(obj[key], dict):
                    check_keys(obj[key], default[key])
                else:
                    if not isinstance(obj[key], type(default[key])):
                        obj[key] = default[key]
        except KeyError:
            obj[key] = default[key]

config = Path('backend/config') # change as needed
JSON_FILE = 'label-settings.json'

config_path = config / JSON_FILE

errors = False

try:
    with open(config_path, 'r') as file:
        content: dict = json.load(file)

    check_keys(content, DEFAULT_KEYS)
    with open(config_path, 'w') as file:
        json.dump(content, file)
        
except (FileNotFoundError, json.JSONDecodeError):
    errors = True
    
if not config_path.exists() or errors is True:
    config_path.touch()

    with open(config_path, 'w') as file:
        json.dump(DEFAULT_KEYS, file)

assets = Path('backend/templates/assets')

if not assets.exists():
    assets.mkdir()