import webview
from utils import parse_table, return_response
from template_parser import generate_html
from pathlib import Path
import shutil, webbrowser
from config.meta import Meta

class API:
    def __init__(self):
        self.config = Meta()
        self.output_dir = self.config.return_output_dir()
        
    def set_output(self) -> dict:
        '''Sets the output directory of where the label will go. By default it is the downloads folder.'''
        output_dir = self.config.get_output_dir()
        
        if output_dir == '':
            return {'status': 'error', 'message': 'EMPTY.INPUT'}

        self.output_dir = output_dir
        self.config.change_output_dir(self.output_dir)

        return {'status': 'success', 'output_folder': self.output_dir}
    
    def upload_logo(self) -> dict:
        '''Move the selected image to the designated assets directory.

        The selected file gets renamed to `logo` with its matching extension.
        '''
        logo_path = self.config.get_logo()

        if logo_path == '':
            return {'status': 'error', 'message': 'EMPTY.INPUT'}

        path = Path(logo_path)

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
        '''Used only for initializing certain states on load for the frontend.'''
        return {'output_folder': self.output_dir, 'theme': self.config.get_config_key('misc', 'darktheme')}

    def read_content(self, buffer: str):
        '''Reads a converted csv/excel base64 string and returns the `DataFrame` from the content.
        
        Parameters
        ----------
            buffer: str
                The base64 string of a csv/excel file.
        '''
        if buffer is not None:
            buffer: list = buffer.split(',')

            if len(buffer) > 2:
                raise ValueError(f'Length of buffer is {len(buffer)}, check the file input.')

            b64_meta: str = buffer[0]
            b64_string: str = buffer[-1]

            file_type = 'excel' if 'spreadsheet' in b64_meta else 'csv'
            
            df = parse_table(b64_string, file_type)

            return return_response(df, 5)
        else:
            return {'status': 'error', 'message': 'INVALID.FILE.TYPE'}
    
    def create_label(self, content):
        try:
            output = generate_html(content)
        except TypeError:
            return {'status': 'error', 'message': 'INVALID.FILE.TYPE'}
        
        # output is going to back into the backend for a hack work around on inserting the logo into the HTML.
        label_output_path = 'backend/templates/label_output.html'
        with open(label_output_path, 'w') as file:
            file.write(output)
        
        webbrowser.open(Path(label_output_path).absolute())
        
        return {'status': 'success'}
    
    def set_theme(self, value: bool):
        bool_res = 'true' if value else 'false'

        self.config.change_dark_theme(bool_res)

if __name__ == '__main__':
    window = webview.create_window('Test', 'http://localhost:5173', js_api=API())
    webview.start(debug=True)