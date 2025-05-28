# About this Program

*TEKLabeler* is a application used to generate labels for printing to:

1. Reduce the errors that the computer image deployer may make and streamline the process of imaging devices.
2. Assist the QA team to ensure proper inspection of the devices before packing and sending them out.
3. Allow the receiving end user know what devices to expect, what software they wanted, and their login information.

For details regarding processes and certain sections of the program, click on any of the tabs above. A rundown of all the available tabs:

- *About*: Documentation regarding what the program is and basic stuff to know.
- *Reports*: Documentation regarding the structure of the report/Excel files.
- *Usage*: Documentation regarding how to use the program.
- *Settings*: Documentation regarding the settings menu.
- *Filters*: Documentation regarding how the filtering process works.
- *Labels*: Documentation regarding the label design and its process.

Each documentation tab has a FAQ section that contains questions and their solutions, if applicable.

If there are any bugs or suggestions, please reach out to me on <font color="red">Github @ bobllor</font>.

# Getting Started

Only <u>Excel files (reports)</u> are accepted in this program.

1. Upload the Excel file to the program and wait for it to load.
2. Click on any card or type in the ticket number to generate the output.
3. Print the output on paper!

For more details on other parts of the program, please visit their respective tabs from above.

# Navigiation

## Shortcuts

I created key shortcuts for quick access to certain parts of the program:

- `Ctrl + F`: Opens the file selector.
- `Ctrl + O`: Opens the settings.
- `Ctrl + H`: Opens the guide documentation.
- `Ctrl + R`: Hard reloads the program. <font color="red">WARNING</font>: This resets the loaded file.

## Basic Navigation

<p align="center">
    <img src="/docs/about-images/basic-navigation-key.png" />
</p>

Header Section:
1. Search Field
2. Incident Form Page
3. Home/Main Page
4. Custom Form Page
5. Secondary Upload File Button
6. Settings
7. Guide Button

Pre-File Upload Main Section:
8. Primary Upload File Button

<p align="center">
    <img src="/docs/about-images/basic-navigation-two-key.png" />
</p>

Post-File Upload Main Section:
9. Ticket Cards

## Guide Navigation

<p align="center">
    <img src="/docs/about-images/guide-basics-key.png" />
</p>

1. Table of Contents
2. Documentation Tabs
3. Main Content

# FAQ

## Will there be support for CSV file types?

Probably not.

The tool was built around ServiceNow reports, and the issue with these CSV reports is that their headers are not human readable. The CSV file uses UUIDs for the headers, meaning:
- Users need to manually map each UUID to a column name. If there are 30 columns, then you would need to fill out 60 fields.
- I would need to write additional logic to work with my existing Excel parsing logic, creating more complexity and development time for little gain.

In comparison, the Excel files are already in human readable format.

On the bright side, I already know how to implement it. While it would be good to implement for further flexibility and future proofing, do I want to do the work for it?... nope.

The <u>mapping the names to the columns</u> idea is great however, and I implemented it with the **required column names** that is expected to be found in every file.
- For more information about the *required column names*, visit the *Reports* tab.
- For configuring the settings, visit the *Settings* tab.