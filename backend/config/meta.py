from tkinter.filedialog import askdirectory, askopenfilename
from configparser import ConfigParser
from pathlib import Path

'''Used to select file paths for the selection choices.'''

'''TODO:
    - check if the file exists, if not create it. this will be done in __init__.py
    - use a JSON file. subject to change.
    - check if any of the options exist.
        - output folder: the chosen output folder for where the items are.
        - logo: technically not required. but 
    - extract the info in the file and use it to determine the stuff.

other info:
    - on the frontend side, it will call a python function to load the json file. this will be used to keep permanent state.
'''
class Meta:
    def __init__(self, config_path: str = 'backend/config/settings.ini'):
        self.config_path = config_path
        
        self.config = ConfigParser()
        self.config.read(self.config_path)

    def get_output_dir(self) -> str:
        '''Get the directory to save the outputs.'''
        output_path = askdirectory()

        return output_path

    def get_logo(self) -> str:
        logo_path = askopenfilename()

        return logo_path

    def return_output_dir(self) -> str:
        '''Reads the config file and returns the output directory.'''
        self.config.read(self.config_path)

        return self.config['paths']['outputfolder']

    def change_output_dir(self, new_output_path: str):
        self.config.read(self.config_path)
        self.config['paths']['outputfolder'] = new_output_path

        with open(self.config_path, 'w') as file:
            self.config.write(file)