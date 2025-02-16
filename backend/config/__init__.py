from pathlib import Path
import json
from .keys import DEFAULT_KEYS

config = Path('backend/config') # change as needed
JSON_FILE = 'label-settings.json'

config_path = config / JSON_FILE

if not config_path.exists():
    config_path.touch()

    with open(config_path, 'w') as file:
        json.dump(DEFAULT_KEYS, file)

assets = Path('backend/templates/assets')

if not assets.exists():
    assets.mkdir()