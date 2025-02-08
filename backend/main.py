import webview
from utils import parse_table, return_response
from template_parser import generate_html
from pathlib import Path

class API:
    def __init__(self):
        self.data = None

    def read_content(self, buffer: str):
        if buffer is not None:
            buffer: list = buffer.split(',')

            if len(buffer) > 2:
                raise ValueError(f'Length of buffer is {len(buffer)}, check the file input.')

            b64_meta: str = buffer[0]
            b64_string: str = buffer[-1]

            file_type = 'excel' if 'spreadsheet' in b64_meta else 'csv'
            
            df = parse_table(b64_string, file_type)

            return return_response(df)
        else:
            return {'status': 'error', 'message': 'INVALID.FILE.TYPE'}
    
    def create_label(self, content):
        try:
            output = generate_html(content)
        except TypeError:
            return {'status': 'error', 'message': 'INVALID.FILE.TYPE'}
        
        '''down_path = Path().home() / 'Downloads'
        with open(f'{down_path}/label.html', 'w') as file:
            file.write(output)'''
        
        return {'status': 'success'}

if __name__ == '__main__':
    window = webview.create_window('Test', 'http://localhost:5173', js_api=API())
    webview.start(debug=True)