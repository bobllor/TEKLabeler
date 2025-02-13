from pathlib import Path
from configparser import ConfigParser

config = Path('backend/config') # change as needed
INI_FILE = 'settings.ini'

config_path = config / INI_FILE

if not config_path.exists():
    config_path.touch()

    config = ConfigParser()

    # can be configured later in the settings.
    config['paths'] = {
        'outputfolder': Path().home() / 'Downloads',
    }

    config['misc'] = {
        'darktheme': 'false',
    }

    with open(config_path.absolute(), 'w') as file:
        config.write(file)

assets = Path('backend/templates/assets')

if not assets.exists():
    assets.mkdir()