import jinja2

def generate_html(items: dict) -> str:
    item_var = {
        'number': items.get('number'),
        'first_name': items.get('first_name'),
        'last_name': items.get('last_name'),
        'customer': items.get('customer_name'),
        'hardware_requested': [items.get('short_description')] + items.get('hardware_requested'),
        'software_requested': items.get('software_requested')
    }

    # probably won't trigger because the dataframe has checks before this point. will keep just in case though.
    if all(val is not None for val in item_var.values()):
        raise ValueError(f'Got type {None} inside dictionary.')

    template_loader = jinja2.FileSystemLoader('./backend/templates')
    template_env = jinja2.Environment(loader=template_loader)
    template = template_env.get_template('label.html')

    output = template.render(item_var)

    return output