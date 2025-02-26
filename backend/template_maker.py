import jinja2
import base64
from pathlib import Path

class TemplateMaker:
    def __init__(self):
        self._template_loader = jinja2.FileSystemLoader('./backend/templates')
        self._template_env = jinja2.Environment(loader=self.template_loader) 

    def generate_html(self, items: dict) -> str:
        '''Generates the label HTML for printing production.'''
        item_var = {
            'number': items.get('number'),
            'first_name': items.get('first_name'),
            'last_name': items.get('last_name'),
            'customer': items.get('customer_name'),
            'hardware_requested': [items.get('short_description')] + items.get('hardware_requested'),
            'software_requested': items.get('software_requested'),
            'logo': self._get_logo_b64('logo'),
            'qr_logo': self._get_logo_b64('qrcode')
        }

        # probably won't trigger because the dataframe has checks before this point. will keep just in case though.
        if all(val is not None for val in item_var.values()):
            raise ValueError(f'Got type {None} inside dictionary.')

        template = self.template_env.get_template('label.html')

        output = template.render(item_var)
        
        return output

    def generate_custom_html(self, items: dict) -> str:
        '''Generates a custom label HTML for printing production.

        This is used only for incidents and custom orders.

        Parameters
        ----------
            items: dict
                A `dict` containing the values needed to generate the label.
        '''
        # these are the same 3 values for both custom RITM and an incident.
        item_var = {
            'ticket_number': items.get('ticket'),
            'name': items.get('name'),
            'company': items.get('company')
        }

        template = self.template_env.get_template('custom_label.html')

        output = template.render(item_var)

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
        
        if len(image_data) < 2:
            # TODO: change this to a proper message im lazy right now - 2/23/2025.
            raise TypeError('Wrong file type detected.')

        with open(assets_dir + image_data[0], 'rb') as file:
            enc = base64.b64encode(file.read())
            decoded_logo = enc.decode('utf-8')
        
        return f'data:image/{image_data[1]};base64,' + decoded_logo