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

    # these columns SHOULD ALWAYS EXIST in the file, without these the program will throw an exception.
    IMPORTANT_COLUMNS = {'number', 'short description', 'customer name', 'full name'}

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

    found: set[str] = set()
    for col in df.columns:
        low_col = col.lower()
        if low_col in IMPORTANT_COLUMNS:
            found.add(low_col)
    
    if len(found) != len(IMPORTANT_COLUMNS):
        not_found: list[str] = [col.title() for col in IMPORTANT_COLUMNS if col not in found]
        return {'status': 'error', 
        'message': f'The Excel file is missing expected columns: {", ".join(not_found)}.'}

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

        for i, (column_name, value) in enumerate(row.items()):
            temp = column_name.lower()

            if temp in IMPORTANT_COLUMNS:
                # these keys are displayed on the frontend and end label, it has to be formatted properly.
                d[temp.replace(' ', '_')] = value

            if temp in cache:
                index, type_ = cache[temp]

                if index == i:
                    if type_ == 'hardware':
                        if value:
                            hardware_list.append(format_column_name(column_name))
                    else:
                        if value:
                            software_list.append(format_column_name(column_name))
                    continue
                elif index != i:
                    del cache[temp]
            
            # flag to prevent additional checks on the software side.
            hardware_found = False

            for filt in hardware_filters:
                if temp.find(filt.lower()) != -1 and value is True:
                    hardware_list.append(format_column_name(column_name))
                    hardware_found = True

                    if temp not in cache:
                        cache[temp] = (i, 'hardware')

                    break
            
            if not hardware_found:
                for filt in software_filters:
                    if temp.find(filt.lower()) != -1 and value is True:
                        software_list.append(format_column_name(column_name))

                        if temp not in cache:
                            cache[temp] = (i, 'software')
                        
                        break
            
            d['hardware_requested'] = hardware_list
            d['software_requested'] = software_list
                
        response.append(d)

    return {'status': 'success', 'data': response}