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
        self.split_name_status = self.config.return_key_value(self.program_settings_config, 'split_name')

        self.column_filter_config: dict[str, list[str]] = self.config._read_config(f'column-data.json')

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
        self.config._write_config('label-settings.json', self.program_settings_config)

        return {'status': 'success', 'message': 'Updated default password.'}
    
    def upload_logo(self) -> dict:
        '''Move the selected image to the designated assets directory.

        The selected file gets renamed to `logo` with its matching extension.
        '''
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
        
        asset_dir = Path('backend/templates/assets')
        for child in asset_dir.iterdir():
            # removes every file that is not the qr.
            if 'qr' not in child.name:
                child.absolute().unlink()

        new_name = 'logo' + path.suffix
        shutil.copy(path.absolute(), asset_dir.absolute())

        moved_logo_path = Path(asset_dir / path.name)
        moved_logo_path.rename(asset_dir / new_name)

        return {'status': 'success', 
            'message': f'Updated label logo.'}

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
            res = return_response(df, self.column_filter_config, 
                split_name=self.split_name_status, cache=self.cache)
            
            if res['status'] == 'success':
                self.config._write_config('column-cache.json', self.cache)
            
            return res
    
    def create_label(self, content: dict):
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
        
        webbrowser.open(Path(label_output_path).absolute())
        
        return {'status': 'success', 'message': 'Label successfully made.'}

    def create_custom_label(self, content: dict, is_incident: bool = True):
        '''Creates an INC or CUSTOM label.
        
        Used for tickets that are not found in the excel.
        '''
        content['password'] = self.default_password
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

if __name__ == '__main__':
    window = webview.create_window('TEKLabler', 'http://localhost:5173', js_api=API(), min_size=(800,600))
    webview.start(debug=True)