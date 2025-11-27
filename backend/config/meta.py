from tkinter.filedialog import askdirectory, askopenfilename
from pathlib import Path
from config.keys import Settings, Columns
import json
from typing import Any

class Meta:
    def __init__(self, config_path):
        '''Class used to set, modify, and retrieve meta data.
        
        Parameters
        ----------
            config_path: str
                The path to the config directory.
        '''
        self.config_path: str = config_path
        self._path: Path = Path(self.config_path)

        if not self._path.exists():
            self._path.mkdir(parents=True, exist_ok=True)
        
        self._validate()

    def return_output_dir(self, data: Any) -> str:
        '''Retrieves the output directory from the settings json file.'''
        return self.return_key_value(data, 'output_folder')

    def change_output_dir(self, new_output_path: str, data: Any) -> None:
        '''Modifies the output directory inside the settings json file.'''
        self._modify_key_value(data, 'output_folder', new_output_path)
        self._write_config(f'label-settings.json', data)

    def change_dark_theme(self, value: bool, data: Any) -> None:
        '''Modifies the output theme inside the program settings json file.

        Parameters
        ----------
            value: bool
                A `bool` indicating whether a dark theme should be used or not.
        '''
        if not isinstance(value, bool):
            raise TypeError(f'Got type {type(value)} instead of {bool}.')

        self._modify_key_value(data, 'dark_theme', value)
        self._write_config(f'label-settings.json', data)
    
    def change_split_name(self, value: bool, data: Any) -> None:
        '''Modifies an option that enables two column names versus only one column name (first + last).'''
        self._modify_key_value(data, 'split_name', value)
        self._write_config('label-settings.json', data)

    def _read_config(self, file_path: str) -> dict:
        try:
            with open(f'{self.config_path}/{file_path}', 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            self._write_config(file_path, {})
    
    def _write_config(self, file_path, obj: Any):
        with open(f'{self.config_path}/{file_path}', 'w') as file:
            json.dump(obj, file)
    
    def _modify_key_value(self, obj: dict, target: str, value) -> None:
        '''Modify a target key's value in a given `dict` in-place and returns `None`.
        
        Parameters
        ----------
            obj: dict
                The `dict` that is being recursively searched through.

            
            target: str
                The target key in the `dict` that is modified.

            
            value
                Any valid data type (`bool`, `int`, `str`, etc...) that is replacing the target `dict` key.

        '''    
        for key in obj:
            if target in obj:
                obj[target] = value
                return
            
            if isinstance(obj[key], dict):
                self._modify_key_value(obj[key], target, value)
            elif isinstance(obj[key], list):
                for ele in obj[key]:
                    self._modify_key_value(ele, target, value)
            else:
                continue
                
        return
    
    def _validate(self):
        # ensures the asset directory exists. this is also checked again in run time.
        asset_dir = Path('backend/templates/assets')

        if not asset_dir.exists():
            asset_dir.mkdir()

        JSON_FILES = [('label-settings.json', Settings.DEFAULT_KEYS), 
                        ('column-data.json', Columns.DEFAULT_KEYS)]

        for file, default_key in JSON_FILES:
            config_path = self._path / file

            try:
                with open(config_path, 'r') as f:
                    content: dict = json.load(f)

                self._check_keys(content, default_key)
                self._check_key_values(content, default_key)

                with open(config_path, 'w') as f:
                    json.dump(content, f)   
            except (FileNotFoundError, json.JSONDecodeError):
                if not config_path.exists():
                    config_path.touch()

                self._write_config(file, default_key)

        # separate check for column-cache file.
        # i did this at 10:50 PM with 4 hours of sleep. sorry!
        cache = ('column-cache.json', {})
        cache_path = self._path / cache[0]

        try:
            with open(cache_path, 'r') as file:
                cache_data = json.load(file)
            
            if type(cache_data) != dict:
                with open(cache_path, 'w') as file:
                    json.dump({}, file)
        except (FileNotFoundError, json.JSONDecodeError):
            if not cache_path.exists():
                cache_path.touch()

            self._write_config(cache[0], {})

    def _check_keys(self, current: dict, default: dict):
        '''Checks for any incorrect data in the keys of the current settings.
        
        This MUST be called before calling check_key_values.
        '''
        for key in current.keys():
            val = default.get(key)

            if val is None:
                del current[key]

    def _check_key_values(self, current: dict, default: dict):
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
                        self._check_key_values(current[key], default[key])
                    else:
                        # resets the value of the key if it isn't the correct type, or
                        # if the key is an empty string if it is a string.
                        if not isinstance(current[key], type(default[key])) or (
                                isinstance(current[key], str) and
                                current[key].strip() == ''):
                            current[key] = default[key]
            except KeyError:
                current[key] = default[key]

    
    def return_key_value(self, obj: dict, target: str):
        '''Search through a given `dict` and return the value of a target key.
        
        Parameters
        ----------
            obj: dict
                The `dict` that is being recursively searched through.

            
            target: str
                The target key that contains the value.
        '''            
        for key in obj:
            if target in obj:
                return obj[target]
            
            if isinstance(obj[key], dict):
                result = self.return_key_value(obj[key], target)
            elif isinstance(obj[key], list):
                for ele in obj[key]:
                    result = self.return_key_value(ele, target)
            else:
                continue
        
            if result is not None:
                return result
                
        return None