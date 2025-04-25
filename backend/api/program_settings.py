from tkinter.filedialog import askdirectory, askopenfilename

def get_output():
    '''Sets the output directory of where the label will go.'''
    output_dir = askdirectory()
    
    if output_dir == '':
        return {'status': 'error', 'message': 'EMPTY.INPUT'}

    return output_dir