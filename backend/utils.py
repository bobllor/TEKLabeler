import pandas as pd
from io import BytesIO
from base64 import b64decode
import re

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

def return_response(df: pd.DataFrame, *, col_filters: dict[str, list[str]], 
            split_name: bool = False, cache: dict[str, list[int, str]] = None,
            important_columns: dict[str, str], word_filters: list[str]) -> dict:
    '''Reads the DataFrame and returns a dict for the response to the front-end.
    
    If there is an error that occurs in this function, then a dict with an
    error status and message is returned instead.

    Parameters
    ----------
        df: DataFrame
            DataFrame of the Excel file.
        
        col_filters: dict[str, list[str]]
            Dictionary of filters with keys "hardware" and "software", containing values
            of a list of strings. Used to filter out column names into their respective category.

        split_name: bool
            A Boolean used to indicate to the function to check for two columns "First Name" and "Last Name"
            inside the DataFrame. By default it is disabled, and can be enabled on the frontend.
        
        cache: dict[str, int]
            A Dictionary consisting of a column name as the key and a list of an integer and a string.
            The function modifies it in-place with lazy updates.

            The integer represents the index of the column name of the DataFrame and the string represents
            the category the column name represents (hardware/software).
        
        important_columns: dict[str, str]
            A Dictionary that contains the column name headers as the keys and the variable names of
            the label generation as the values.

            The **keys** are the column names that is expected to be found in the Excel headers, this can
            be edited by the user on the frontend.
            The **values** are the variable names that are used in create_label method call, 
            this cannot be changed.
        
        col_filters: list[str]
            A list of strings that are used to remove certain words from columns, if found.
    '''
    # in case any of the data is missing, then replace with false.
    df.fillna(False, inplace=True)
    df.columns = map(str.lower, df.columns)
    
    # this prevents the original list from getting mutated, as the first and last name are keys deleted.
    important_col_copy = important_columns.copy()

    # combines two column names into single full name, and deletes them if this option is enabled.
    if split_name is True:
        # get the column header mapping.
        first_name = important_col_copy['first name']
        last_name = important_col_copy['last name']
        full_name = important_col_copy['full name']

        try:
            df[full_name] = df[first_name] + ' '  + df[last_name]
        except KeyError:
            return {'status': 'error', 
            'message': f'''The Excel file is missing columns: {first_name.title()} or {last_name.title()}.
                    Check Excel headers or use the "First & Last Name Support" option.'''}

        df.drop(columns=[first_name, last_name], inplace=True)
    
    # combining the two into one full name, it has to be removed for the dataframe
    # to not error out later during the validation.
    del important_col_copy['first name']
    del important_col_copy['last name']

    # reverses the dict so we can compare the column headers in the validate_df_columns function.
    # this is also used in the generate response call.
    rev_imp_cols = {value: key for key, value in important_col_copy.items()}

    # returns a dict with a status, message, and data. it can be "success" or "error".
    validate_res = validate_df_columns(df, rev_imp_cols)

    if validate_res['status'] == 'error':
        return validate_res

    # each element repsents a row in the DataFrame. the columns are the keys for each value.
    rows_list = [dict(zip(df.columns, row)) for row in df.values.tolist()]

    hardware_filters = set(col_filters['hardware'])
    software_filters = set(col_filters['software'])

    # sorry...
    response = generate_response_data(rows_list, hardware_filters, 
        software_filters, rev_imp_cols, cache, word_filters)
    
    return {'status': 'success', 'data': response}

def generate_response_data(rows_list: list[dict[str, str]], 
                        hardware_filters: list[str], 
                        software_filters: list[str],
                        important_columns: dict[str, str],
                        cache: dict = None,
                        word_filters: list = ['']) -> dict[str, str | list[str]]:
    '''Helper function to generate the response and send it back to the parent call.
    
    Caching is modified in-place in this function.

    The arguments of the function are the same as the return_response parent.
    '''
    response = []

    # FIXME: temporary list. make a dynamic option for this one (yay!...).
    def format_column_name(word: str, replace_words: list[str]) -> str:
        '''Helper function to replace matching words given from a list of words with regex.'''
        # longest strings need to go first due to an early exit with regex upon a match.
        sorted_words = sorted(replace_words, key=lambda x: len(x), reverse=True)

        pattern = r'\b(' + '|'.join(sorted_words) + r')\b'

        word = re.sub(pattern, '', word)

        return word.strip().title()

    for row in rows_list:
        hardware_list = []
        software_list = []
        d = {}

        for i, (column_name, value) in enumerate(row.items()):
            low_col_name = column_name.lower()
            
            # FIXME: maybe move this out of this function.
            if low_col_name in important_columns:
                # this gets the value of the dictionary, which is used in the label generation and
                # displayed on the front end.
                important_name = important_columns.get(low_col_name).lower()

                # these keys are displayed on the frontend and generated label, 
                # it has to be formatted properly.
                d[important_name.replace(' ', '_')] = value
                continue
                
            # cache check, avoids the nested loops later if it is found.
            if cache and low_col_name in cache:
                index, type_ = cache[low_col_name]
                in_filter: bool = column_name in hardware_filters or column_name in software_filters
                
                if index == i and in_filter:
                    if type_ == 'hardware':
                        if value:
                            hardware_list.append(format_column_name(column_name, word_filters))
                        
                        elif isinstance(value, str) and value.strip() != '':
                            software_list.append(value)
                    else:
                        if value is True:
                            software_list.append(format_column_name(column_name, word_filters))
                        
                        # flexibility in case other values other than "True/False" are needed
                        # yes i found this out.
                        elif isinstance(value, str) and value.strip() != '':
                            software_list.append(value)
                            
                    continue
                # lazy updating for the cache if it isn't valid.
                elif index != i and not in_filter:
                    del cache[low_col_name]
            
            # flag to prevent additional checks on the software side.
            hardware_found = False

            for filt in hardware_filters:
                # add the column name to the category only if it is True.
                if low_col_name.find(filt.lower()) != -1 and value is not False:
                    if isinstance(value, bool):
                        hardware_list.append(format_column_name(column_name, word_filters))
                    elif isinstance(value, str):
                        hardware_list.append(value)

                    hardware_found = True

                    if cache and low_col_name not in cache:
                        cache[low_col_name] = (i, 'hardware')

                    break
            
            if not hardware_found:
                for filt in software_filters:
                    if low_col_name.find(filt.lower()) != -1 and value is not False:
                        # same as the above comment in the hardware loop.
                        if isinstance(value, bool):
                            software_list.append(format_column_name(column_name, word_filters))
                        elif isinstance(value, str):
                            software_list.append(value)

                        if cache and low_col_name not in cache:
                            cache[low_col_name] = (i, 'software')
                        
                        break
            
            d['hardware_requested'] = hardware_list
            d['software_requested'] = software_list
                
        response.append(d)

    return response

def validate_df_columns(df: pd.DataFrame, rev_imp_cols: dict[str, str]) -> dict[str, str]:
    '''Helper function used to validate the important columns of the program if it can be
    found in the DataFrame before parsing.

    The important columns are reversed in order to properly check the dataframe column names.
    
    Returns a dict containing a key status of error and a message or a success and no message.
    '''
    found: set[str] = set()

    for col in df.columns:
        low_col = col.lower()

        if low_col in rev_imp_cols:
            found.add(low_col)

    if len(found) != len(rev_imp_cols):
        not_found: list[str] = [col.title() for col in rev_imp_cols if col not in found]

        msg = f'''The columns in the Excel file does not match 
        the expected values: {", ".join(not_found)}. Check Excel headers or use the
        "First & Last Name Support" option.'''

        return {'status': 'error', 'message': msg}

    return {'status': 'success', 'message': 'Expected columns are found.'}