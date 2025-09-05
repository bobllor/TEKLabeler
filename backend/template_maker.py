import jinja2
import base64
import qrcode
from typing import Iterable
from pathlib import Path
from support.validation import name_validation

class TemplateMaker:
    def __init__(self):
        self._template_loader = jinja2.FileSystemLoader('./backend/templates')
        self._template_env = jinja2.Environment(loader=self._template_loader)

    def generate_html(self, items: dict) -> str:
        '''Generates the label HTML for printing production.'''
        full_name = items.get('full_name')

        item_var = {
            'number': items.get('number').upper(),
            'full_name': name_validation(full_name),
            'company': items.get('customer_name'),
            'hardware_requested': [items.get('short_description')] + items.get('hardware_requested'),
            'software_requested': items.get('software_requested'),
            'logo': self._get_logo_b64('logo'),
            'password': items.get('password')
        }

        self._make_qr(item_var['full_name'])

        item_var['qr_logo'] = self._get_logo_b64('qrcode')

        template = self._template_env.get_template('label.html')

        output = template.render(item_var)
        
        return output

    def generate_custom_html(self, items: dict[str, str], is_incident: bool, do_not_modify: Iterable[str] = set()) -> str:
        '''Generates a custom label HTML for printing production.

        This is used only for incidents and custom orders.

        Parameters
        ----------
            items: dict[str, str]
                A `dict` containing the values needed to generate the label.
            
            is_incident: bool
                The custom label is an incident type label.
            
            do_not_modify: Iterable[str], default set()
                An iterable of strings used to prevent any modifications to the string.
                It is recommended to use a set here for quick lookups. By default it is an empty set. 
        '''
        for key, value in items.items():
            if key in do_not_modify:
                continue
            elif key != 'ticket':
                items[key] = value.upper() 
            else:
                items[key] = value.title()

        name: str = items.get('name')

        item_var: dict[str, str] = {
            'number': items.get('ticket').upper(),
            'full_name': name_validation(name),
            'company': items.get('company'),
            'logo': self._get_logo_b64('logo'),
            'hardware_requested': items.get('hardware'),
            'password': items.get('password')
        }

        self._make_qr(item_var['full_name'])
        item_var['qr_logo'] = self._get_logo_b64('qrcode')
        
        label_type: str = 'incident_label.html' if is_incident else 'custom_label.html'

        template = self._template_env.get_template(label_type)

        output: str = template.render(item_var)

        return output

    def _get_logo_b64(self, file_name: str) -> str:
        '''Returns a base64 string of given file name.
        
        Parameters
        ----------
            file_name: str
                The name of the file inside assets folder.
        '''
        assets_dir: str = 'backend/templates/assets/'
        assets_path: Path = Path(assets_dir)

        # [0] is the logo name, [1] is the suffix of the logo name.
        image_data: list[str] = []

        for child in assets_path.iterdir():
            if child.suffix in {'.jpg', '.png', '.svg', '.webp', '.avif', '.jpeg'} and file_name.lower() in child.name.lower():
                image_data.append(child.name)
                image_data.append(child.suffix)
                break
       
        # if there is no logo for whatever reason, then return nothing.
        if len(image_data) < 2:
            return ''

        with open(assets_dir + image_data[0], 'rb') as file:
            enc = base64.b64encode(file.read())
            decoded_logo = enc.decode('utf-8')
        
        return f'data:image/{image_data[1]};base64,' + decoded_logo
    
    def _make_qr(self, name: str):
        name_list = name.split()

        f_name, l_name = name_list[0], name_list[-1]

        qr_img = qrcode.make(f'{f_name}.{l_name}\r{f_name} {l_name}')

        qr_img.save('backend/templates/assets/qrcode.png')