import jinja2
import base64
from pathlib import Path

def get_logo_b64(company_logo: bool = True) -> str:
    assets_dir: str = 'backend/templates/assets/'
    assets_path: Path = Path(assets_dir)

    asset_name = 'logo.png' if company_logo else 'test.png'

    # [0] is the logo name, [1] is the suffix of the logo name.
    image_data: list[str] = []

    for child in assets_path.iterdir():
        if child.suffix in {'.jpg', '.png', '.svg', '.webp', '.avif', '.jpeg'} and child.name == asset_name:
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

def generate_html(items: dict) -> str:
    '''Generates the label HTML for printing production.'''
    item_var = {
        'number': items.get('number'),
        'first_name': items.get('first_name'),
        'last_name': items.get('last_name'),
        'customer': items.get('customer_name'),
        'hardware_requested': [items.get('short_description')] + items.get('hardware_requested'),
        'software_requested': items.get('software_requested'),
        'logo': get_logo_b64(),
        'qr_logo': get_logo_b64(company_logo=False)
    }

    # probably won't trigger because the dataframe has checks before this point. will keep just in case though.
    if all(val is not None for val in item_var.values()):
        raise ValueError(f'Got type {None} inside dictionary.')

    template_loader = jinja2.FileSystemLoader('./backend/templates')
    template_env = jinja2.Environment(loader=template_loader)
    template = template_env.get_template('label.html')

    output = template.render(item_var)

    return output