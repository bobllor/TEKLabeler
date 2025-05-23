from pathlib import Path

'''This file contains the default keys and values used to correct invalid data on startup.'''

class Settings:
    '''Default values for the settings of the application.'''
    path_keys: dict = {
        'output_folder': str((Path().home() / 'Downloads').absolute())
    }
    
    # you would think that having a password here in a config file is bad, but hear me out:
    #   1. the label already prints out the password, which can be seen physically.
    #   2. when the end user logs in, the password is reset to their choice.
    #   3. if the laptop is intercepted mid-delivery, we can brick the laptop remotely.
    misc_keys: dict = {
        'split_name': False,
        'dark_theme': False,
        'default_password': 'PLACEHOLDER'
    }

    DEFAULT_KEYS: dict = {
        'paths': path_keys,
        'misc': misc_keys,
    }

class Columns:
    '''Default values of the column filters from the file to the application.'''
    hardware_data: list = []
    software_data: list = []

    # the keys are the internal variable names for the program.
    # the values are the user defined column header names.
    important_columns = {
        'number': 'number', 
        'short description': 'short description', 
        'customer name': 'customer name', 
        'full name': 'full name',
        'first name': 'first name',
        'last name': 'last name'
    }

    word_filters: list = []

    DEFAULT_KEYS: dict = {
        'hardware': hardware_data,
        'software': software_data,
        'important_columns': important_columns,
        'word_filters': word_filters
    }