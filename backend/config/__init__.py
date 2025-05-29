from pathlib import Path
import json
from .keys import Columns, Settings

def check_key_values(current: dict, default: dict):
    '''Check the values of the keys in the current configurations.
    
    Parameters
    ----------
        current: dict
            The current content of the json file. This is used to check for any
            invalid data and correcting them.

        default: dict
            A dict that contains the default keys of the json file. These values replace
            any invalid data found in current.
    '''
    for key in default:
        try:
            if current[key] != default[key]:
                # navigates through the dict.
                if isinstance(current[key], dict) and isinstance(default[key], dict):
                    check_key_values(current[key], default[key])
                else:
                    # resets the value of the key if it isn't the correct type, or
                    # if the key is an empty string if it is a string.
                    if not isinstance(current[key], type(default[key])) or (
                            isinstance(current[key], str) and
                            current[key].strip() == ''):
                        current[key] = default[key]
        except KeyError:
            current[key] = default[key]

def check_keys(current: dict, default: dict):
    '''Checks for any incorrect data in the keys of the current settings.
    
    This MUST be called before calling check_key_values.
    '''
    for key in current.keys():
        val = default.get(key)

        if val is None:
            del current[key]

def write_file(path: str, data) -> None:
    with open(path, 'w') as file:
        json.dump(data, file)

# ensures the asset directory exists. this is also checked again in run time.
asset_dir = Path('backend/templates/assets')

if not asset_dir.exists():
    asset_dir.mkdir()

config = Path('backend/config')

JSON_FILES = [('label-settings.json', Settings.DEFAULT_KEYS), 
                ('column-data.json', Columns.DEFAULT_KEYS)]

for file, default_key in JSON_FILES:
    config_path = config / file
    errors = False

    try:
        with open(config_path, 'r') as file:
            content: dict = json.load(file)

        check_keys(content, default_key)
        check_key_values(content, default_key)

        with open(config_path, 'w') as file:
            json.dump(content, file)   
    except (FileNotFoundError, json.JSONDecodeError):
        if not config_path.exists():
            config_path.touch()

        write_file(config_path, default_key)

# separate check for column-cache file.
# i did this at 10:50 PM with 4 hours of sleep. sorry!
cache = ('column-cache.json', {})
cache_path = config / cache[0]

try:
    with open(cache_path, 'r') as file:
        cache_data = json.load(file)
    
    if type(cache_data) != dict:
        with open(cache_path, 'w') as file:
            json.dump({}, file)
except (FileNotFoundError, json.JSONDecodeError):
    if not cache_path.exists():
        cache_path.touch()

    write_file(cache_path, {})