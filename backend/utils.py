import pandas as pd
from io import BytesIO
from base64 import b64decode

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

def return_response(df: pd.DataFrame, col_boundary: int = 5) -> dict:
    '''Returns a `dict` that is used as a response to an API call.
    
    Parameters
    ----------
        df: DataFrame
            Used to parse the `DataFrame` from the loaded file.


        col_boundary: int, optional
            Used as the boundary position that separates the immutable metadata 
            from the mutable requested hardware/software data inside the `DataFrame`. Default is 5.
    '''
    df_base_vals = df.iloc[:, :col_boundary]

    df_base_vals.rename(columns={col: col.lower().replace(' ', '_') for col in df_base_vals.columns}, inplace=True)
    df_base_vals['first_name'].apply(lambda x: x.strip().title())
    df_base_vals['last_name'].apply(lambda x: x.strip().title())

    df_checks = df.iloc[:, col_boundary:]
    df_checks.fillna(False, inplace=True)

    software_names = {'Add Symantec Antivirus'}

    remove = lambda x: x.replace('Add a ', '').replace('Add ', '')

    data: list = []
    for i in range(df_checks.index.stop):
        base = df_base_vals.iloc[i].to_dict()

        v = df_checks.iloc[i].to_dict()
        
        hardware_list: list = []
        software_list: list = []
        for key, value in v.items():
            if value is True:
                if key not in software_names:
                    hardware_list.append(remove(key))
                else:
                    software_list.append(remove(key))
        
        desired_software = df_checks.iloc[i]['Desired Software']
        
        if desired_software:
            software_list.append(desired_software)

        base['hardware_requested'] = hardware_list
        base['software_requested'] = software_list

        # short_description is not included in hardware_list, so one is added to the amount.
        base['hardware_amount'] = len(hardware_list) + 1
        base['software_amount'] = len(software_list)

        data.append(base)
        
    return {'status': 'success', 'data': data}

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