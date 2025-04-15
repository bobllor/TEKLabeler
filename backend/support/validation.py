import re, string

def name_validation(name: str) -> str:
    '''Returns the corrected first and last name from a string.
    
    This method does not account for misspelling or accidental words. Those validations should be 
    handeled on the frontend, due to many edge cases the backend will not handle these.
    '''
    special_chars = set(string.punctuation)
    
    chars = []
    for c in name:
        if c not in special_chars and not c.isdigit():
            chars.append(c)
        
        if c == '-':
            chars.append(' ')

    name = ''.join(chars)
    
    name_list = name.split()

    unwanted_words = {'jr', 'sr', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'the', 'of'}

    new_name: list[str] = []

    for name in name_list:
        name = name.lower().strip()
        
        is_valid: bool = re.match('^([A-Za-z]*)$', name) != None
        has_bad_words: bool = name in unwanted_words

        if is_valid and not has_bad_words and len(name) > 1:
            new_name.append(name.title())

    # catastrophic error, this is only if an input contains no valid characters.
    # maybe do the validation on the frontend side?...
    if not new_name:
        raise ValueError('An invalid name was entered.')

    f_name: str = new_name[0]
    l_name: str = new_name[-1]

    # if the full name is 20 characters long, then only use the first letter of the first name.
    if len(f'{f_name} {l_name}') > 20:
        return f'{f_name[0]} {l_name}'

    return f'{f_name} {l_name}'