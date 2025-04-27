from tkinter.filedialog import askdirectory, askopenfilename

def get_output():
    '''Sets the output directory of where the label will go.'''
    output_dir = askdirectory()

    return output_dir