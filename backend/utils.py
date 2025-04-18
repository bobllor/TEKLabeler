import pandas as pd
from io import BytesIO
from base64 import b64decode
from support.validation import name_validation

def parse_table(buffer: bytes, file_type: str = 'csv') -> pd.DataFrame:
    '''Takes a bytes buffer .csv or .xlsx file, parses the data and returns a `DataFrame`.'''
    if not isinstance(file_type, str):
        raise TypeError(f'Expected file_type to be {str}, got {type(file_type)}')
    
    if file_type not in {'csv', 'excel'}:
        raise ValueError(f'Exepected file_type value to be "csv" or "excel", got "{file_type}"')
    
    pd_read = pd.read_csv if file_type == 'csv' else pd.read_excel

    decoded_data = b64decode(buffer)
    data = BytesIO(decoded_data)

    df = pd_read(data)

    return df

def return_response(df: pd.DataFrame, filters: dict):
    # in case any of the data is missing, then replace with false.
    df.fillna(False, inplace=True)

    # these columns SHOULD ALWAYS EXIST in the file, without these the program will throw an exception.
    IMPORTANT_COLUMNS = {'number', 'full name', 'short description', 'customer name'}

    rows_list = [dict(zip(df.columns, row)) for row in df.values.tolist()]

    hardware_filters = filters['hardware']
    software_filters = filters['software']
    
    response = []

    # the return is inserted in the HTML for the label to be printed.
    format_column_name = lambda x: x.replace('Add a', '').replace('Add', '').strip().title()

    for row in rows_list:
        hardware_list = []
        software_list = []
        d = {}

        for column_name, value in row.items():
            temp = column_name.lower()

            if temp in IMPORTANT_COLUMNS:
                # these keys are displayed on the frontend and end label, it has to be formatted properly.
                d[temp.replace(' ', '_')] = value
            
            # flag to prevent additional checks on the software side.
            hardware_found = False

            for filt in hardware_filters:
                if temp.find(filt.lower()) != -1 and value is True:
                    hardware_list.append(format_column_name(column_name))
                    hardware_found = True

                    break
            
            if not hardware_found:
                for filt in software_filters:
                    if temp.find(filt.lower()) != -1 and value is True:
                        software_list.append(format_column_name(column_name))

                        break
            
            d['hardware_requested'] = hardware_list
            d['software_requested'] = software_list
                
        response.append(d)

    return {'status': 'success', 'data': response}

def response_message(status: str, msg: str) -> dict:
    '''Returns a `dict` with two key-value pairs: status and message.
    
    Parameters
    ----------
        status: str
            Indicates the status of the response, only allowed values are `success` and `error`.
        
        
        msg: str
            The message to send with the response for additional information on the status.
    '''
    for inp in [status, msg]:
        if not isinstance(inp, str):
            raise TypeError(f'Expected {str} but got {type(inp)}.')
        
    if status.lower() not in {'error', 'success'}:
        raise ValueError(f'Expected "error" or "success" but got "{status}".')

    return {'status': status, 'message': msg}