# About Settings

The Settings menu can be accessed via the cog wheel in the top right area, or by accessing via shortcut "`Ctrl + O`".

There are two tabs in the settings:
1. *General*: General options for the program.
2. *Label*: Options that affect the output of the label and how the program parses the file.

Clicking on a tab will display the relevant options for the tab name.

# General Tab

The general tab contain the general options for the program, it consists of two options:
1. ***Output Folder***: Change the output directory of the label.
2. ***Dark Theme***: Change the theme of the program with dark/light.

The *output directory* location is where the final output will be placed. This does not effect the overall functionality of the program, but rather it is for convienence in case you need access to the HTML document.

Dark theme mode changes the look of the program from a blinding tan to a cool gray... it's self explanatory really.

# Label Tab

The label tab consists of options that directly affect the label's structure and how the program parses the data.
<br/>
These options are:
1. ***First & Last Name Support***: Enables the program to check for two columns "First Name" and "Last Name" instead of a single "Full Name".
2. ***Column Filters***: Used to filter out column headers to their respective category.
    - Consists of two buttons: "`Hardware`" and "`Software`".
    - The program expects a <u>CSV-style</u> input to filter out column names.
3. ***Column Mapping***: A form field that lets the user map special key column names to any custom column name. 
    - The form contains six fields: Number, Full Name, Short Description, Customer Name, First Name, and Last Name.
    -  <font color="red">WARNING</font>: This is an advanced feature, I recommend reading below for more information before editing these values.
4. ***Word Filters***: An input of words that will get filtered out in the column headers from the final output.
    - The expected input **format** is a <u>CSV-style</u>.
5. ***Upload Logo***: Upload a logo to display on the generated label. This is <u>not required</u>.
    - Minimum requirement of 932w x 207h.
6. ***Default Password***: Changes the password display on the label. 
    - This is the default password to the computer for deployment for the end user to log in with. 
    - This <u>***does not set the password***</u> to the device, it is dependent on the person who set the passwords to the devices. 
    - The default password is only used for *relaying the login info* to the user. Please **do not input** sensitive information here.

There are separate documentation tabs for **Column Mapping** and **Filters** options, read them for more details.

## Resetting Values

<p align="center">
    <img src="/docs/settings-images/settings-arrows.png">
</p>

There is an arrow button to reset to the default values located next to the buttons for these tabs:
1. ***Column Filters***: Both hardware and software have their own respective reset buttons.
2. ***Column Mapping***
3. ***Word Filters***
4. ***Upload Logo***

<p align="center">
    <img src="/docs/settings-images/settings-modal.png">
</p>

If the arrow button is clicked, there will be a modal popup that asks for confirmation to prevent accidental resets, as shown below.

As a warning, <u>this resets the current values</u> to its default values.