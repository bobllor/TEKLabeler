# About Filters

The filters in this program are used to <u>filter columns into two groups</u>, **hardware** and **software**.
- The two groups are used on the label to show what the requested items are- helping the image deployer, QA, and the end user.
- The headers of the Excel file are referred to as columns in here.

To modify filters, they can be accessed via the Settings menu by clicking on any of the two buttons at the bottom labeled "Hardware" and "Software".

<p align="center">
    <img src="/docs/filters-images/settings-menu-filters-circled.png" height="75%" width="75%">
</p>

Upon selection of either button, you will be greeted with a new pop-up box that contains a text area:

<p align="center">
    <img src="/docs/filters-images/filter-image.png" height="75%" width="75%">
</p>

To submit a new filter, "Enter" is pressed to submit the new filter and update the program.
- It is mentioned below, but ensure that the input is in a **CSV-style** format.

# Filter Customization and How to Use

The displayed filters are <u>formatted</u> in a **CSV-style** text, and the input is also <u>expected</u> to be in a **CSV-style**.
- CSV, also known as Comma-seperated values, is a text format that uses commas as the delimiter to separate the values.

The input is automatically corrected in case multiple commas are given or an empty space is between two commas. <u>However</u>, everything else (spaces, special characters, etc...) are not ignored.
- I recommend typing each filter ***with no spaces*** because the program searches the filter <u>if it is found in the column name</u> rather than an exact match.
- However, nothing is stopping you from adding special characters or spaces- this is more prone to error than having a single keyword.

<p align="center">
    <img src="/docs/filters-images/filter-image-with-text.png" height="75%" width="75%">
</p>

In the example above, the filters are for the *hardware* group: monitor, yubikey, dock, and lifechat.
This filter reflects on the label dynamically, and these four (if applicable) will show under the correct grouping on the label.

<p align="center">
    <img src="/docs/filters-images/label-hardware-example.png" height="75%" width="75%">
</p>

The generated label above displays the monitor under the hardware column. However, if the filter for "monitor" is removed and submitted, then the label will update accordingly:

<p align="center">
    <img src="/docs/filters-images/label-hardware-example-no-monitor.png" height="75%" width="75%">
</p>

As seen, the new label will no longer display the monitor under the hardware column. If you really wanted to, you could move that same monitor filter to the software section instead:

<p align="center">
    <img src="" height="75%" width="75%">
</p>

# FAQ

## Why are the filters made?

This is what makes the program dynamic and flexible, I wanted to let the user change the columns as needed.

I wrote it like this because a previous script written by someone else did not account for that. I wanted to future proof this program as much as possible.
