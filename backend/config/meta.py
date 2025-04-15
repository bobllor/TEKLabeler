from tkinter.filedialog import askdirectory, askopenfilename
from pathlib import Path
import json
from typing import Any

class Meta:
    def __init__(self, config_path: str = 'backend/config/'):
        '''Class used to set, modify, and retrieve meta data.
        
        Parameters
        ----------
            config_path: str
                Relative path to the json files. By default all files are located in `backend/config/'.
        '''
        self.config_path: str = config_path

    def return_output_dir(self, data: Any) -> str:
        '''Retrieves the output directory from the settings json file.'''
        return self.return_key_value(data, 'output_folder')

    def change_output_dir(self, new_output_path: str, data: Any) -> None:
        '''Modifies the output directory inside the settings json file.'''
        self._modify_key_value(data, 'output_folder', new_output_path)
        self._write_config(f'{self.config_path}label-settings.json', data)

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
        self._write_config(f'{self.config_path}label-settings.json', data)

    def _read_config(self, file_path: str) -> dict:
        with open(file_path, 'r') as file:
            return json.load(file)
    
    def _write_config(self, file_path, obj: Any):
        with open(file_path, 'w') as file:
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