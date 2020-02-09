# Agapia

This is the documentation for the GUI editor for Agapia. It uses mxGraph(draw.io engine) in order to build the graphs and interact with them. In this document we will go over the features of the editor, how to use it and how to change functionality. 

## Features

The Agapia editor has some of the base mxGraph features and some custom build features especially built for the Agapia language. Let's describe those features. 

### Custom node element

The nodes in the Agapia graph editor are actually comprised of 5 nodes. We have the main node and 4 more nodes which are used in order to denote the input/output ports(North, East, South, West). The connection from the main node with edges to other nodes is disabled. The only way to connect the modules is by doing composition of modules(a.k.a. connecting an East node to a west one or a South node to a North node). A module can be double-clicked in order to change its name. If you focus a module, you'll see in the right hand side of the editor that a text area will be displayed. There you can write the code that defines what functionality this module has. Nodes also have a button that, when clicked, it will minimize the box in order to give you some more space to work with. 

### Edges connections

As discussed above, connections between different modules can be done via edges. In order to specify what are the output variables of a module and the input for another, you have to click on the desired port and specify those variables in the text edit box in the right side. 

### Toolbar

In the left side we have a toolbar from where we can drag and drop a new module intro the graph model. 

### Undo and redo

We also have undo and redo functionalities either through the two buttons at the top or the shortcuts `cmd+z`(undo) and `tab+z`(redo).

### Zoom

We also have to buttons to zoom in and out of the graph.

### Export graph

Clicking this button will get the graph xml and display it into a popup window.(This should be changed in the future in order to interpret the xml into Agapia code and compile it.)

### Import graph.

Clicking this button will import an existing graph into xml format. For the moment, a predefined string is written in the code and imported. To be noted that  the imported xml string has to define only the elements in the graph, as they are added sequencially, not to be the whole xml structure. 

## Future functionalities

All the functionalities for the Agapia editor are for now implemented inside the `agapia.js` file. The features that now need to be implemented for the editor to communicate with the backend are the following:

### Implement a backend

A backend that gets the xml schema and interprets it needs to be implemented in order to create functional modules. After the backend is implemented, the GUI has to be connected with it via HTTP requests. The server has to simulate an HTTP server and to get requests from the GUI and return responses. 

### Find a good implementation for the import

The import functionality is not yet complete and a format of importing an existing graph has to be decided on. 

### Work more on the styling

The style of the GUI is pretty rudimentary at the moment, so changes in the `style.css` file for a better aspect would be required. 

## More documentation

For any extra functionality on mxGraph engine check the official mxGraph documentation. All the functions implemented for the Agapia editor have been documented inside the code. 