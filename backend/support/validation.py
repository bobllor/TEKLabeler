import re, string

def name_validation(name: str) -> str:
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
        is_valid: bool = re.match('^([A-Za-z]*)$', name.lower().strip()) != None
        has_bad_words: bool = name.lower() in unwanted_words

        if is_valid and not has_bad_words and len(name) > 1:
            new_name.append(name.title())

    f_name:str = new_name[0]
    l_name:str = new_name[-1]

    if len(f'{f_name} {l_name}') > 20:
        return f'{f_name[0]} {l_name}'

    return f'{f_name} {l_name}'