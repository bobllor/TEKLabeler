from pathlib import Path
import json
from.keys import Columns, Settings

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
                    # resets the value of the key if it isn't the correct type.
                    if not isinstance(current[key], type(default[key])):
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

config = Path('backend/config') # change as needed

JSON_FILES = [('label-settings.json', Settings.DEFAULT_KEYS), ('column-data.json', Columns.DEFAULT_KEYS)]

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

        with open(config_path, 'w') as file:
            json.dump(default_key, file)