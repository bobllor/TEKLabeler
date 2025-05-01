import pandas as pd
from io import BytesIO
from base64 import b64decode
from support.validation import name_validation

def parse_table(buffer: bytes) -> pd.DataFrame:
    '''Takes a bytes buffer .xlsx file, parses the data and returns a `DataFrame`.
    
    Parameters
    ----------
        buffer: bytes
            The buffer that represents the data of the file.
    '''    
    decoded_data = b64decode(buffer)
    data = BytesIO(decoded_data)

    df = pd.read_excel(data)

    return df

def return_response(df: pd.DataFrame, filters: dict, split_name: bool = False, cache: dict = None) -> dict:
    '''Reads the DataFrame and returns a dict for the response to the front-end.
    
    If there is an error that occurs in this function, then a dict with an
    error status and message is returned instead.
    '''
    # in case any of the data is missing, then replace with false.
    df.fillna(False, inplace=True)

    # flexibility in case the user wants to use a report with first and last name only.
    # this is only true if they enable the option on the front end.
    if split_name is True:
        # the name gets validated later.
        try:
            df['Full Name'] = df['First Name'] + ' '  + df['Last Name']
        except KeyError:
            return {'status': 'error', 
            'message': 'The Excel file is missing a "First Name" or "Last Name" column.'}

        df.drop(columns=['First Name', 'Last Name'], inplace=True)
    
    # these columns SHOULD ALWAYS EXIST in the file, without these the program will throw an exception.
    IMPORTANT_COLUMNS = {'number', 'short description', 'customer name', 'full name'}

    # i could of made this return true or false, but i had a error message tied to the original one...
    validate_res = validate_df_columns(df, IMPORTANT_COLUMNS)

    if validate_res['status'] == 'error':
        return validate_res

    # each element repsents a row in the DataFrame. the columns are the keys for each value.
    rows_list = [dict(zip(df.columns, row)) for row in df.values.tolist()]

    hardware_filters = set(filters['hardware'])
    software_filters = set(filters['software'])

    # sorry...
    response = generate_response_data(rows_list, hardware_filters, software_filters, IMPORTANT_COLUMNS, cache)
    
    return {'status': 'success', 'data': response}

def generate_response_data(rows_list: list[dict[str, str]], 
                        hardware_filters: dict[str], 
                        software_filters: dict[str],
                        IMPORTANT_COLUMNS,
                        cache) -> dict[str, str | list[str]]:
    '''Helper function to generate the response and send it back to the parent call.
    
    Caching is changed and implemented in here.
    '''
    response = []

    # the return is inserted in the HTML for the label to be printed.
    format_column_name = lambda x: x.replace('Add a', '').replace('Add', '').strip().title()

    for row in rows_list:
        hardware_list = []
        software_list = []
        d = {}

        for i, (column_name, value) in enumerate(row.items()):
            temp = column_name.lower()

            if temp in IMPORTANT_COLUMNS:
                # these keys are displayed on the frontend and end label, it has to be formatted properly.
                d[temp.replace(' ', '_')] = value

            if temp in cache:
                index, type_ = cache[temp]
                in_filter: bool = column_name in hardware_filters or column_name in software_filters

                if index == i and in_filter:
                    if type_ == 'hardware':
                        if value:
                            hardware_list.append(format_column_name(column_name))
                        
                        elif isinstance(value, str) and value.strip() != '':
                            software_list.append(value)
                    else:
                        if value is True:
                            software_list.append(format_column_name(column_name))
                        
                        # flexibility in case other values other than "True/False" are needed
                        # yes i found this out.
                        elif isinstance(value, str) and value.strip() != '':
                            software_list.append(value)
                            
                    continue
                elif index != i and not in_filter:
                    del cache[temp]
            
            # flag to prevent additional checks on the software side.
            hardware_found = False

            for filt in hardware_filters:
                if temp.find(filt.lower()) != -1 and value is not False:
                    # same as the cache above, but if there is no cache.
                    if isinstance(value, bool):
                        hardware_list.append(format_column_name(column_name))
                    elif isinstance(value, str):
                        hardware_list.append(value)

                    hardware_found = True

                    if temp not in cache:
                        cache[temp] = (i, 'hardware')

                    break
            
            if not hardware_found:
                for filt in software_filters:
                    if temp.find(filt.lower()) != -1 and value is not False:
                        # same as the above comment in the hardware loop.
                        if isinstance(value, bool):
                            software_list.append(format_column_name(column_name))
                        elif isinstance(value, str):
                            software_list.append(value)

                        if temp not in cache:
                            cache[temp] = (i, 'software')
                        
                        break
            
            d['hardware_requested'] = hardware_list
            d['software_requested'] = software_list
                
        response.append(d)

    return response

def validate_df_columns(df: pd.DataFrame, IMPORTANT_COLUMNS: set[str]) -> dict[str, str]:
    '''Helper function used to validate the columns of a DataFrame before parsing.
    
    Returns a dict containing a key status of error and a message or a success and no message.
    '''
    found: set[str] = set()

    for col in df.columns:
        low_col = col.lower()

        if low_col in IMPORTANT_COLUMNS:
                found.add(low_col)
    
    if len(found) != len(IMPORTANT_COLUMNS):
        not_found: list[str] = [col.title() for col in IMPORTANT_COLUMNS if col not in found]
        return {'status': 'error', 
        'message': f'The Excel file is missing expected columns: {", ".join(not_found)}.'}

    return {'status': 'success', 'message': 'Expected columns are found.'}