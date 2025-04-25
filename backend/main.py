import webview
from tkinter.filedialog import askdirectory, askopenfilename
from utils import parse_table, return_response
from template_maker import TemplateMaker
from pathlib import Path
import shutil, webbrowser
from config.meta import Meta
import api.program_settings as settings

class API:
    '''
    Functions from various modules are imported which support the API class.

    `settings`: Contains functions that are related to the program overall.
    '''
    def __init__(self):
        self.config: Meta = Meta()
        self.templater: TemplateMaker = TemplateMaker()

        self.program_settings_config: dict = self.config._read_config(f'label-settings.json')
        self.output_dir: str = self.config.return_output_dir(self.program_settings_config)
        self.cache: dict = self.config._read_config('column-cache.json')

        self.column_filter_config: dict[str, list[str]] = self.config._read_config(f'column-data.json')
        
    def set_output(self):
        '''Sets the output directory of where the label will go. By default it is the downloads folder.'''
        self.output_dir = settings.get_output()

        self.config.change_output_dir(self.output_dir, self.program_settings_config)

        return {'status': 'success', 'output_folder': self.output_dir}
    
    def upload_logo(self) -> dict:
        '''Move the selected image to the designated assets directory.

        The selected file gets renamed to `logo` with its matching extension.
        '''
        logo_path = askopenfilename(filetypes=(('Images', ['.jpg', '.png', '.svg', '.webp', '.avif']),))

        if logo_path == '':
            return {'status': 'error', 'message': 'EMPTY.INPUT'}

        path = Path(logo_path)

        # if for whatever reason a non-image is given
        if path.suffix not in {'.jpg', '.png', '.svg', '.webp', '.avif'}:
            return {'status': 'error', 'message': 'INVALID.FILE.TYPE'}
        
        new_name = 'logo' + path.suffix
        path = path.rename(path.parent / new_name)

        asset_dir = Path('backend/templates/assets')
        for child in asset_dir.iterdir():
            if 'logo' in child.name:
                child.absolute().unlink()

        shutil.move(path.absolute(), asset_dir.absolute())

    def on_load(self):
        '''Used only for initializing states for the settings on load for the frontend.'''
        # column filter config will be joined on the front end side, as well as for validation
        # before writing changes to the backend.
        return {'output_folder': self.output_dir, 
                'theme': self.config.return_key_value(self.program_settings_config, 'dark_theme'),
                'column_filters': self.column_filter_config}

    def read_content(self, buffer: str) -> dict | bool:
        '''Reads a csv/excel base64 string and returns a `dict` as a response.

        In the event of a bad file read, `False` is returned.
        
        Parameters
        ----------
            buffer: str
                The base64 string of a csv/excel file.
        '''
        if buffer is not None:
            buffer: list = buffer.split(',')

            if len(buffer) > 2:
                raise ValueError(f'Length of buffer is {len(buffer)}, check the file input.')
           
            b64_string: str = buffer[-1]
            
            # this is mainly to prevent hard reloads in case a bad file is given on the frontend.
            try:
                df = parse_table(b64_string)
                res = return_response(df, self.column_filter_config, cache=self.cache)
            except:
                return False
            
            self.config._write_config('column-cache.json', self.cache)
            
            return res
    
    def create_label(self, content: dict):
        try:
            output = self.templater.generate_html(content)
        except TypeError:
            return {'status': 'error', 'message': 'INVALID.FILE.TYPE'}
        
        # output is going to back into the backend for a hack work around on inserting the logo into the HTML.
        # i could convert the logo into a b64 and insert it to the src... nah.
        label_output_path = self.output_dir + '/label_output.html'
        with open(label_output_path, 'w') as file:
            file.write(output)
        
        webbrowser.open(Path(label_output_path).absolute())
        
        return {'status': 'success'}

    def create_custom_label(self, content: dict, is_incident: bool = True):
        '''Creates an INC or CUSTOM label.
        
        Used for tickets that are not found in the excel.
        '''
        output = self.templater.generate_custom_html(content, is_incident)
        label_output_path = self.output_dir + '/inc_output.html' if is_incident else '/man_output.html'
        
        with open(label_output_path, 'w') as file:
            file.write(output)
        
        webbrowser.open(Path(label_output_path).absolute())

    def set_filter(self, new_filters: list[str], filter_type: str):
        '''Used to set a new filter for the excel parsing.
        
        Parameters
        ----------
            new_filter: list[str]
                A list of strings that represents the new filter to replace the current filters.
                It is not case sensitive.
            
            filter_type: str
                A string that indicates the target filter category. The argument
                must contain `hardware` and `software`.
        '''
        category = 'hardware' if 'hardware' in filter_type else 'software'
        curr_filters = self.column_filter_config['hardware'] if category == 'hardware' else self.column_filter_config['software']
        
        # the frontend already has this check, but just in case i miss something...
        if new_filters == curr_filters:
            return
        
        self.column_filter_config[category] = new_filters
        
        self.config._write_config('column-data.json', self.column_filter_config)
    
    def set_theme(self, value: bool) -> None:
        theme = self.config.return_key_value(self.program_settings_config, 'dark_theme')
        
        if value != theme:
            self.config.change_dark_theme(value, self.program_settings_config)
    
    def set_split_name(self, value: bool) -> None:
        split_name_value = self.config.return_key_value(self.program_settings_config, 'split_name')

        if value != split_name_value:
            self.config.change_split_name(value, self.program_settings_config)

if __name__ == '__main__':
    window = webview.create_window('Label-Maker-3000', 'http://localhost:5173', js_api=API())
    webview.start(debug=True)