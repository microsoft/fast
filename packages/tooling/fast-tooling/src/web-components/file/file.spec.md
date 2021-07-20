# Abstract
This spec outlines the functionality of the File web component.

## Overview
This component will facilitate the rendering of a file picker UI with a modular system of actions to be performed once a file is picked. 

## Interaction
The component will appear as a button that when clicked will open the system file picker UI optionally configured for particular file types. Once a file is chosen the component will perform the configured action on that file (i.e. convert it to an ObjectURL, upload it to a server, etc) and return a string representation of the file (a file name, URL that can be used in the `src` attribute of an img tag, etc) or the system File object.

## Implementation
The component will be a form-associated control that will use an input type=file element as its base. In addition a `FileAction` interface will be defined that specifies methods for taking action on the image file once it is selected. The component will expect an `onchange` callback function as well as an instance of the `FileAction` interface. When a file is selected by the user the component will execute the code provided by the `FileAction` class which will produce a string which will then be returned through the `onchange` callback function. 

## Out of scope
The initial implementation of the component will only include one implementation of the `FileAction` interface which will utilize the `URL.createObjectURL()` API to store the image locally and return an `Object URL`. In the future additional `FileAction` classes may be easily implemented to perform tasks such as uploading the file to a server and returning a remote URL.
