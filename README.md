# TEKLabler - A ServiceNow IT Asset Management Tool

An application to assist with laptop deployments, powered by ServiceNow request items.

# About

The application generates HTML documents to print into labels, containing information from ServiceNow request items.

It primarily assists with the deployment team, easing the deployment process and producing less mistakes by
preventing multiple trips to retain information in deployment requirements from a client.

It assists with the QA team, enabling easy QA checks on the device without having to leave to retrieve information from
a different source.

It provides information to the end user of their requested items and their about their device.

It features:
- Parses ServiceNow reports in the form of an Excel file.
- Customizable settings for a custom workflow.
- Display requested items on the label as requested by the end user.
- Customizable filters for a custom label display.

# Installation

In the [releases](https://github.com/bobllor/TEKLabeler/releases) page will consist of the latest release.
It is recommended to use the latest release as it will have the latest bug fixes and features.

Installation can be done one of two ways:
1. Download the `.exe` and install it.
2. Downloading the ZIP file, unzip it to a location, and run the `.exe` inside the folder.

## Updating

To update the program:
- Grab the latest `.exe` file and re-install. The files are automatically changed.
- Unzipping the new ZIP file and replacing all contents.

## Uninstalling

If installed via the installer:
- Control Panel > Programs > Uninstall a program > Select TEKLabler and uninstall.
- PC Settings > Apps > Apps & Features > Search TEKLabler and uninstall.

If installed via ZIP file:
- Delete the folder holding the files.

# Usage

Before using the program, the program expects the Excel file to be formatted a certain way.

In summary, there are 4 columns (+ 2 if using first/last name):
1. `Full name`: Full name of the user.
2. `Short description`: The description of the device.
3. `Customer Name`: The company name.
4. `Number`: The request item ticket number.
5. `First name`*
6. `Last name`*

To read more about the reports and Excel file, [click here](docs/02reports.md).

**NOTE**: The Excel file headers vary from environment to environment. Inside the settings contains a
customizable mapping option to correct the internal variables used to parse the Excel. To read more
about mapping Excel headers, [click here](docs/05mapping.md).

Upon a successful file read, it will display all the data back on the UI in the form of a card box.

Clicking on one of these boxes or searching the ticket number will generate the label output.
To read more about the usage, [click here](docs/03usage.md).