import webview
from tkinter.filedialog import askopenfilename
from utils import parse_table, return_response
from template_maker import TemplateMaker
from pathlib import Path
from pathlib import WindowsPath
from support.validation import remove_digits
import mistune
from mistune.toc import add_toc_hook
import shutil, webbrowser
from config.meta import Meta
import api.program_settings as settings
from PIL import Image
from config.keys import Columns

LABEL_SETTINGS = 'label-settings.json'
COLUMN_DATA = 'column-data.json'
COLUMN_CACHE = 'column-cache.json'
ASSET_PATH = Path('backend/templates/assets')

class API:
    '''
    Functions from various modules are imported which support the API class.

    `settings`: Contains functions that are related to the program overall.
    '''
    def __init__(self):
        self.config: Meta = Meta()
        self.templater: TemplateMaker = TemplateMaker()

        self.program_settings_config: dict = self.config._read_config(LABEL_SETTINGS)
        self.output_dir: str = self.config.return_output_dir(self.program_settings_config)

        self.cache: dict = self.config._read_config(COLUMN_CACHE)
        self.split_name_status = self.config.return_key_value(self.program_settings_config, 'split_name')

        self.column_filter_config: dict[str, list[str]] = self.config._read_config(COLUMN_DATA)

        # NOTE: the user defined column headers are the values.
        self.important_columns: dict[str, str] = self.column_filter_config['important_columns']

        self.word_filters: list[str] = self.column_filter_config['word_filters']

        self.default_password: str = self.config.return_key_value(
            self.program_settings_config, 
            'default_password')
        
    def set_output(self):
        '''Sets the output directory of where the label will go. By default it is the downloads folder.'''
        output = settings.get_output()

        if output == '':
            return {'status': 'error', 'output_folder': 'No folder chosen.'}

        self.output_dir = output

        self.config.change_output_dir(self.output_dir, self.program_settings_config)

        return {'status': 'success', 'output_folder': self.output_dir}
    
    def set_password(self, content: str):
        '''Sets the default password to display on the label.'''
        if content == self.default_password or content.strip() == '':
            return {'status': 'error', 'message': 'placeholder'}
        
        self.config._modify_key_value(self.program_settings_config, 'default_password', content)
        self.config._write_config(LABEL_SETTINGS, self.program_settings_config)
        self.default_password = content

        return {'status': 'success', 'message': 'Updated default password.'}
    
    def upload_logo(self) -> dict:
        '''Move the selected image to the designated assets directory.

        The selected file gets renamed to `logo` with its matching extension.
        '''
        # also exists in init, this ensures that in runtime it also exists.
        if not ASSET_PATH.exists():
            ASSET_PATH.mkdir()

        logo_path = askopenfilename(filetypes=(('Images', ['.jpg', '.png']),))
        
        if logo_path == '':
            # can just ignore this really... i just needed something here.
            return {'status': 'misc', 'message': 'No logo given.'}

        path = Path(logo_path)
        # checks for the image size to be a minimum of 932 x 207
        with Image.open(logo_path) as img:
            logo_w, logo_h = img.size
        
        if logo_w < 932 or logo_h < 207:
            return {'status': 'error',
            'message': f'Current dimensions {logo_w}x{logo_h} do not meet the requirement minimum of 932x207.'}

        # i am 99.95% sure this will not ever trigger. but just in case it does.
        if path.suffix not in {'.jpg', '.png'}:
            return {'status': 'error', 
            'message': f'Unsupported file type, got {path.suffix} file.'}
        
        for child in ASSET_PATH.iterdir():
            # removes every file that is not the qr.
            if 'qr' not in child.name:
                child.absolute().unlink()

        new_name = 'logo' + path.suffix
        shutil.copy(path.absolute(), ASSET_PATH.absolute())

        moved_logo_path = Path(ASSET_PATH / path.name)
        moved_logo_path.rename(ASSET_PATH / new_name)

        return {'status': 'success', 
            'message': f'Updated label logo.'}
        
    def reset_logo(self):
        '''Reset the uploaded logo to its default value.'''
        for child in ASSET_PATH.iterdir():
            if 'qr' not in child.name:
                child.absolute().unlink()

        return {'status': 'success', 'message': 'Resetted uploaded logo'}

    def on_load(self):
        '''Used only for initializing states for the settings on first load for the frontend.'''
        # column filter config will be joined on the front end side, as well as for validation
        # before writing changes to the backend.
        return {'output_folder': self.output_dir, 
                'theme': self.config.return_key_value(self.program_settings_config, 'dark_theme'),
                'column_filters': self.column_filter_config,
                'split_name': self.config.return_key_value(self.program_settings_config, 'split_name')}

    def read_content(self, buffer: str) -> dict:
        '''Reads a csv/excel base64 string and returns a `dict` as a response.

        If a bad file is read, a response is returned containing a error status and the error message.
        
        Parameters
        ----------
            buffer: str
                The base64 string of a csv/excel file.
        '''
        if buffer is not None:
            buffer: list = buffer.split(',')
           
            b64_string: str = buffer[-1]
            
            # this is mainly to prevent hard reloads in case a bad file is given on the frontend.
            df = parse_table(b64_string)
            
            # can return an "error" response instead.
            res = return_response(df, col_filters=self.column_filter_config, 
                split_name=self.split_name_status, cache=self.cache, 
                important_columns=self.column_filter_config['important_columns'],
                word_filters=self.word_filters)
            
            if res['status'] == 'success':
                self.config._write_config(COLUMN_CACHE, self.cache)
            
            return res
    
    def create_label(self, content: dict):
        # yes i copied and pasted this.
        if not ASSET_PATH.exists():
            ASSET_PATH.mkdir()
            
        content['password'] = self.default_password

        output = self.templater.generate_html(content)
        label_output_path = self.output_dir + '/label_output.html'
        
        try:
            with open(label_output_path, 'w') as file:
                file.write(output)
        except Exception:
            # in the event of a catastrophic write failure, it will default to the Downloads
            # folder of the computer.
            self.output_dir = str(Path().home() / 'Downloads')
            self.config.change_output_dir(self.output_dir, self.program_settings_config)

            label_output_path = self.output_dir + '/label_output.html'
            
            with open(label_output_path, 'w') as file:
                file.write(output)
        
        # i have a linux laptop so this needs to be done... it works on windows though (my computer).
        webbrowser.open(str(Path(label_output_path).absolute()))
        
        return {'status': 'success', 'message': 'Label successfully made.'}

    def create_custom_label(self, content: dict, is_incident: bool = True):
        '''Creates an INC or CUSTOM label.
        
        Used for tickets that are not found in the excel.
        '''
        # allows for temporary custom passwords for custom labels
        password: str = content.get("password", "")
        if password.strip() == "":
            content['password'] = self.default_password

        do_not_modify_keys: set[str] = {"password"}

        output = self.templater.generate_custom_html(content, is_incident, do_not_modify_keys)
        label_output_path = f"{self.output_dir}{'/inc_output.html' if is_incident else '/man_output.html'}"

        label_path = Path(label_output_path)

        with open(label_path.absolute(), 'w') as file:
            file.write(output)
        
        webbrowser.open(label_path.absolute())

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
        
        self.config._write_config(COLUMN_DATA, self.column_filter_config)
    
    def set_theme(self, value: bool) -> None:
        theme = self.config.return_key_value(self.program_settings_config, 'dark_theme')
        
        if value != theme:
            self.config.change_dark_theme(value, self.program_settings_config)
    
    def set_split_name(self, value: bool) -> None:
        if value != self.split_name_status:
            self.config.change_split_name(value, self.program_settings_config)
            self.split_name_status = value
        
    def on_load_guide_content(self) -> dict[str, str]:
        '''Called from the frontend on load to load the documentation guide text.'''
        docs_path = Path('docs')

        files: list[WindowsPath] = [child for child in docs_path.iterdir() if child.suffix == '.md']

        temp_dict = {}
        for file in files:
            with open(file, 'r') as f:
                temp_dict[file.name] = f.read()

        md = mistune.create_markdown(escape=False)
        add_toc_hook(md)

        data = []
        # used for the first markdown content for loading default page first.
        default_content_active = False
        for file in files:
            response = {}

            html, state = md.parse(temp_dict[file.name])
            items = state.env['toc_items']

            temp = []
            for level, id_, label in items:
                temp.append({'label': label, 'id': id_, 'level': level})
            
            response['active'] = False if default_content_active else True

            # only related applied to the first response. every other response will be false by default.
            if not default_content_active: 
                default_content_active = True
                
            response['title'] = remove_digits(file.name)
            response['content'] = html
            response['toc'] = temp
            data.append(response)
    
        return {'status': 'success', 'data': data}
    
    def set_important_column_map(self, content: dict[str, str]):
        '''Sets the important column from a form on the frontend.
        
        Parameters
        ----------
            content: dict[str, str]
                A dictionary with keys being the internal column names and the 
                values being the Excel header names.
        ''' 
        # flag that triggers an update to the config
        is_changed = False

        # var_name is the internal name i use in a future function call.
        for var_name, column_name in content.items():
            lower_col = column_name.lower()
            lower_var = var_name.lower()

            if lower_col != '' and lower_col != self.important_columns[lower_var]:
                self.important_columns[lower_var] = lower_col
                if not is_changed: is_changed = True
        
        if is_changed:
            self.config._modify_key_value(
                self.column_filter_config, 'important_columns', self.important_columns
            )

            self.config._write_config(COLUMN_DATA, self.column_filter_config)

            return {'status': 'success', 'message': 'Successfully updated column mapping.'}
        
        return {'status': 'error', 'message': 'No filters were updated.'}
    
    def load_important_columns(self) -> dict[str, str]:
        '''Sends the important columns as a response to send to the frontend.'''
        return self.important_columns
    
    def set_word_filters(self, content: list[str]) -> dict[str, str]:
        '''Updates the config for the list of word filters.'''
        # no checks needed because the frontend checks for them.
        
        self.word_filters = content
        
        self.config._modify_key_value(
            self.column_filter_config, 'word_filters', self.word_filters
        )

        self.config._write_config(COLUMN_DATA, self.column_filter_config)

        return {'status': 'success', 'message': 'Successfully updated word filters.'}

    def load_word_filters(self) -> dict[str: list[str]]:
        '''Sends the list of words that are to be filtered out for the columns to the frontend.'''
        return {'status': 'success', 'data': self.word_filters}
    
    def reset_defaults(self, data_type: str) -> dict[str, str]:
        '''Resets a config setting to its default values based on the given data type.'''
        
        HARDWARE = Columns.DEFAULT_KEYS['hardware']
        SOFTWARE = Columns.DEFAULT_KEYS['software']
        IMP_COLS = Columns.DEFAULT_KEYS['important_columns']
        WORD_FILTERS = Columns.DEFAULT_KEYS['word_filters']

        data_string = 'Hardware Filters'

        # err i hope this doesn't bite me back.
        if 'hardware' in data_type:
            self.set_filter(HARDWARE, data_type)
        elif 'software' in data_type:
            self.set_filter(SOFTWARE, data_type)
            data_string = 'Software Filters'
        elif 'columnMapping' in data_type:
            self.set_important_column_map(IMP_COLS)
            data_string = 'Column Mapping'
        elif 'wordFilter' in data_type:
            self.set_word_filters(WORD_FILTERS)
            data_string = 'Word Filters'

        return {'status': 'success', 'message': f'Values of {data_string} has been resetted to its defaults.'}

if __name__ == '__main__':
    path = Path('dist/index.html')

    window = webview.create_window('TEKLabeler', f'file://{path.absolute()}', js_api=API(), 
        min_size=(800,600), confirm_close=True)
    webview.start()