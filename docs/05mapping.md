# About Column Mapping

The *Column Mapping* option is used to map the <u>required Excel values</u> to your specific values. It can be accessed via the Settings menu under the "Label" tab.

These required values, as mentioned in the Reports documentation, are what my program expects to exist in any file it reads.

## Column Mapping Option

The "Column Mapping" option is used to map user defined column names to the required column names for the labels.
- If the columns in an Excel file does not match the default column names, then this option <u>**must be**</u> used.
- The inputs are ***not case sensitive***, however the spelling ***must match***.

<p align="center">
    <img src="/docs/mapping-images/mapping-columns.png">
</p>

There are <u>six fields</u> available in this form, with three input fields being dependent on the *First & Last Name Support* option- those being "Full Name", "First Name", and "Last Name".
- If you are <u>not using two column names</u>, then the "First Name" and "Last Name" fields can be ignored.
- If you are <u>using two column names</u>, then the "Full Name" field can be ignored.

<p align="center">
    <img src="/docs/mapping-images/mapping-duplicates.png">
</p>

*Duplicate* values <u>are not allowed</u> in the field, only unique values are allowed. The form refuses to submit if there are duplicate values detected.
- The fields are highlighted in red if there are duplicate values.

When an input is submitted, the program will expect the values to be the column names of the Excel file.
- Example: if you submitted the form with an input "Some Name", the program will look for "Some Name" to process and input the data onto the final output.

It is <u>not required</u> to give a value for each input.
<br/>
If *values are given*, then the program will replace the stored values with the new one.
<br/>
If *no values are given*, then the program will use the values that were already stored previously.
- Only the inputs that you need to replace can be submitted, everything else can be ignored.

This is technically ***"optional"*** if you follow the headers of my pre-made report on ServiceNow or the Github, but it is **required** if you are using an Excel file that doesn't have what the program expects.

# FAQ

## Why did you make the column name mapping?

I first encountered the issue when working with an old ServiceNow report, where the expected "Customer Name" column was written as "Customer Name:". At the time I had more on my plate to work with, but I always had this in the back of my head.

This allows the program to handle any type of Excel file that may contain different column names than the ones I work with- hence why they are "Full Name", "Customer Name", "Short Description", and "Number".
- For more information on what these are, visit the Reports documentation tab.

## I am having an issue with the program saying some columns are missing?

This is a indicator that the required column headers are missing from the file, in other words the program is expecting either a different set of column headers or your file is missing them entirely.
- For the former, this can be done by setting the **Column Mapping** tab with the details.
- For the latter, ensure that the headers in the Excel files do exist. If you are using a *first* and *last* name column, then please ensure the "First & Last Name Support" option is enabled and the column mapping is correct.

It can be because you are using an Excel file that isn't supported, or that I may have overlooked some issue. Regardless, you can contact me with the column headers used in the file so I can look into it further.