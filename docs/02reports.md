# Reports

There are <font color="red">**four**</font> columns that <u>must exist</u> in every report:

1. Full name* - The client's name.
2. Short description - The main item being requested.
3. Customer name - The client's company they are under.
4. Number - The RITM number of the requested item (RITM1234567).

*Full name is only required if the "First & Last Name Support" option is disabled in the Settings menu. 
If it is enabled, then the program <u>expects two columns</u> instead of a single "Full Name":

1. First name
2. Last name

<p align="center">
    <img src="/docs/settings-images/settings-menu-split-name-circled.png" />
</p>

The remaining columns for the filters will be divided into two categories: *hardware* and *software*.
- This is dependent on the input of the filters- visit the *Filters* tab for more information.

The end result will show on the label, as seen below.

<p align="center">
    <img src="/docs/label-images/label-example-no-keys.png" width="80%">
</p>

For more information on the label, visit the *Label* tab.

The columns in the report can be modified as needed, you can choose what is available to the report or not.
- I heavily recommend to use my report template *Labels - Production (Improved)* as a starting point.

# FAQ

## Why are there four/five columns that must exist in every report?

These columns are required because the generated label requires them. If they were missing, then the program will either crash or the label will turn out poorly.

I'd rather not have either result, so the program will reject any files missing these columns.

## Does column order matter?

No.

I implemented a lazy cache system in the program so order of the columns does not matter.

I recommend trying to keep them in the same position so it can be a bit more efficient and faster, but in the end it doesn't make a difference.

## I want to add X, Y, and Z to the columns!

Go ahead, nothing is stopping you. Be aware that you need to *update* the <u>column filters</u> if you want it to reflect on the label.