from tkinter.filedialog import askdirectory, askopenfilename
from configparser import ConfigParser
from pathlib import Path

class Meta:
    def __init__(self, config_path: str = 'backend/config/settings.ini'):
        '''Class used to set, modify, and retrieve meta data.
        
        Parameters
        ----------
            config_path: str
                Relative path to the settings.ini file. By default it is located in `backend/config/'.
        '''
        self.config_path = config_path
        
        self.config = ConfigParser()
        self.config.read(self.config_path)

    def get_output_dir(self) -> str:
        '''Returns the absolute path of the output directory.'''
        output_path = askdirectory()

        return output_path

    def get_logo(self) -> str:
        '''Returns the absolute path of the chosen logo.'''
        logo_path = askopenfilename()

        return logo_path

    def return_output_dir(self) -> str:
        '''Reads the config file and returns the output directory.'''
        self.config.read(self.config_path)

        return self.config['paths']['outputfolder']

    def change_output_dir(self, new_output_path: str) -> None:
        '''Changes the output directory for the label.'''
        self.config.read(self.config_path)
        self.config['paths']['outputfolder'] = new_output_path

        with open(self.config_path, 'w') as file:
            self.config.write(file)