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

def return_response(df: pd.DataFrame, filters: dict[str, list[str]], 
            split_name: bool = False, cache: dict[str, list[int, str]] = None, *,
            important_columns: dict[str, str] = {
                'number': 'number', 
                'short description': 'short description', 
                'customer name': 'customer name', 
                'full name': 'full name'}) -> dict:
    '''Reads the DataFrame and returns a dict for the response to the front-end.
    
    If there is an error that occurs in this function, then a dict with an
    error status and message is returned instead.

    Parameters
    ----------
        df: DataFrame
            DataFrame of the Excel file.
        
        filters: dict[str, list[str]]
            Dictionary of filters with keys "hardware" and "software", containing values
            of a list of strings. This is obtained from the frontend.

        split_name: bool
            A Boolean used to indicate to the function to check for two columns "First Name" and "Last Name"
            inside the DataFrame. By default it is disabled, and can be enabled on the frontend.
        
        cache: dict[str, int]
            A Dictionary consisting of a column name as the key and a list of an integer and a string.
            This is updated in-place in this function, and is updated lazily.

            The integer represents the index of the column name of the DataFrame and the string represents
            the category the column name represents (hardware/software).
        
        important_columns: dict[str, str]
            A Dictionary that holds the immutable column keys and its expected column name.
            The keys are the column names that is expected to be found in the Excel headers, this can
            be edited by the user on the frontend.

            The values are the variable names that are used in create_label method call, this cannot be
            changed and is the label name of the form input.

            By default it has values assigned if None is passed.
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

    # i could of made this return true or false, but i had a error message tied to the original one...
    validate_res = validate_df_columns(df, important_columns)

    if validate_res['status'] == 'error':
        return validate_res

    # each element repsents a row in the DataFrame. the columns are the keys for each value.
    rows_list = [dict(zip(df.columns, row)) for row in df.values.tolist()]

    hardware_filters = set(filters['hardware'])
    software_filters = set(filters['software'])

    # sorry...
    response = generate_response_data(rows_list, hardware_filters, software_filters, important_columns, cache)
    
    return {'status': 'success', 'data': response}

def generate_response_data(rows_list: list[dict[str, str]], 
                        hardware_filters: dict[str], 
                        software_filters: dict[str],
                        important_columns: dict[str, str],
                        cache) -> dict[str, str | list[str]]:
    '''Helper function to generate the response and send it back to the parent call.
    
    Caching is changed and implemented in here.
    '''
    response = []

    # the return for this lambda is inserted in the HTML for the label to be printed.
    # this probably will either do as it's expected or bite me back in the ass.
    format_column_name = lambda x: x.replace('Add a', '').replace('Add', '').strip().title()


    for row in rows_list:
        hardware_list = []
        software_list = []
        d = {}

        for i, (column_name, value) in enumerate(row.items()):
            low_col_name = column_name.lower()
            
            if low_col_name in important_columns:
                # this gets the value of the dictionary, which is used in a future function call.
                important_name = important_columns.get(low_col_name)

                # these keys are displayed on the frontend and generated label, 
                # it has to be formatted properly.
                d[important_name.replace(' ', '_')] = value
                continue

            if low_col_name in cache:
                index, type_ = cache[low_col_name]
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
                    del cache[low_col_name]
            
            # flag to prevent additional checks on the software side.
            hardware_found = False

            for filt in hardware_filters:
                if low_col_name.find(filt.lower()) != -1 and value is not False:
                    # same as the cache above, but if there is no cache.
                    if isinstance(value, bool):
                        hardware_list.append(format_column_name(column_name))
                    elif isinstance(value, str):
                        hardware_list.append(value)

                    hardware_found = True

                    if low_col_name not in cache:
                        cache[low_col_name] = (i, 'hardware')

                    break
            
            if not hardware_found:
                for filt in software_filters:
                    if low_col_name.find(filt.lower()) != -1 and value is not False:
                        # same as the above comment in the hardware loop.
                        if isinstance(value, bool):
                            software_list.append(format_column_name(column_name))
                        elif isinstance(value, str):
                            software_list.append(value)

                        if low_col_name not in cache:
                            cache[low_col_name] = (i, 'software')
                        
                        break
            
            d['hardware_requested'] = hardware_list
            d['software_requested'] = software_list
                
        response.append(d)

    return response

def validate_df_columns(df: pd.DataFrame, important_columns: dict[str, str]) -> dict[str, str]:
    '''Helper function used to validate the important columns of the program if it can be
    found in the DataFrame before parsing.
    
    Returns a dict containing a key status of error and a message or a success and no message.
    '''
    found: set[str] = set()

    for col in df.columns:
        low_col = col.lower()

        if low_col in important_columns:
                found.add(low_col)
    
    if len(found) != len(important_columns):
        not_found: list[str] = [col.title() for col in important_columns if col not in found]
        return {'status': 'error', 
        'message': f'The Excel file is missing expected columns: {", ".join(not_found)}.'}

    return {'status': 'success', 'message': 'Expected columns are found.'}