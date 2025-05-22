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

The label tab consists of options that directly affect the label's structure and how the program parses the data:
1. ***First & Last Name Support***: Enables the program to check for two columns "First Name" and "Last Name" instead of a single "Full Name".
2. ***Column Filters***: Consists of two buttons, "`Hardware`" and "`Software`", that filters out column names to the respective category.
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

For more information about the filters, visit the Filters documentation tab.

## Column Mapping Option

The "Column Mapping" option is used to map user defined column names to the required column names for the labels (Full Name, Short Description, Number, Customer Name, *First Name, *Last Name).
- If the columns in an Excel file does not match the default column names, then this option <u>**must be**</u> used.
- The inputs are ***not case sensitive***, however the spelling ***must match***.

There are <u>six fields</u> available in this form, with three input fields being dependent on the *First & Last Name Support* option- those being "Full Name", "First Name", and "Last Name".
- If you are <u>not using two column names</u>, then the "First Name" and "Last Name" fields can be ignored.
- If you are <u>using two column names</u>, then the "Full Name" field can be ignored.

When an input is entered into the fields and processed by the program, the program will then expect the values to be the column names of the Excel file.
- Example: if you have a column named "Some Name" and then submitted the form, the program will look for "Some Name" to process and input the data onto the final output.

If *values are given*, then the program will replace the stored values with the new one.
<br/>
If *no values are given*, then the program will use the values that were already stored previously.
- Only the inputs that you need to replace can be submitted, everything else can be ignored.

In case you want to revert back to the default values, there is a button at the top left of the form that resets the values to default.
- You can also input the input field names for each one manually for the same result.
- <font color="red">IMPORTANT</font>: This resets all values in the form to its default value. Do not use this if you don't want to lose all column names.

I recommend to update the column names <u>as needed</u>.

# FAQ

## Why did you make the column name mapping?

I first encountered the issue when working with an old ServiceNow report, where the expected "Customer Name" column was written as "Customer Name:". At the time I had more on my plate to work with, but I always had this in the back of my head.

This allows the program to handle any type of Excel file that may contain different column names than the ones I work with- hence why they are "Full Name", "Customer Name", "Short Description", and "Number".
- For more information on what these are, visit the Reports documentation tab.