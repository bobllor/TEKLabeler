from pathlib import Path

'''This file contains the default keys and values in case the json is ever missing either.'''

path_keys: dict = {
    'output_folder': str((Path().home() / 'Downloads').absolute())
}

misc_keys: dict = {
    'dark_theme': False
}

DEFAULT_KEYS: dict = {
    'paths': path_keys,
    'misc': misc_keys
}