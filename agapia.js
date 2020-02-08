function main()
{
    // Defines an icon for creating new connections in the connection handler.
    // This will automatically disable the highlighting of the source vertex.
    mxConnectionHandler.prototype.connectImage = new mxImage('images/connector.gif', 16, 16);

    // Checks if browser is supported
    if (!mxClient.isBrowserSupported())
    {
        // Displays an error message if the browser is
        // not supported.
        mxUtils.error('Browser is not supported!', 200, false);
    }
    else
    {
        // Creates the div for the toolbar
        var tbContainer = document.createElement('div');
        tbContainer.style.position = 'absolute';
        tbContainer.style.overflow = 'hidden';
        tbContainer.style.padding = '2px';
        tbContainer.style.left = '0px';
        tbContainer.style.top = '26px';
        tbContainer.style.width = '26px';
        tbContainer.style.bottom = '0px';
        
        document.body.appendChild(tbContainer);
    
        // Creates new toolbar without event processing
        var toolbar = new mxToolbar(tbContainer);
        toolbar.enabled = false
        
        // Creates the div for the graph
        container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.overflow = 'hidden';
        container.style.left = '24px';
        container.style.top = '26px';
        container.style.right = '0px';
        container.style.bottom = '0px';
        container.style.width = '70%'
        container.style.background = 'url("editors/images/grid.gif")';

        document.body.appendChild(container);
        
        // Workaround for Internet Explorer ignoring certain styles
        if (mxClient.IS_QUIRKS)
        {
            document.body.style.overflow = 'hidden';
            new mxDivResizer(tbContainer);
            new mxDivResizer(container);
        }

        // Creates the model and the graph inside the container
        // using the fastest rendering available on the browser
        var model = new mxGraphModel();
        var graph = new mxGraph(container, model);
        graph.dropEnabled = true;
        
        // Matches DnD inside the graph
        mxDragSource.prototype.getDropTarget = function(graph, x, y)
        {
            var cell = graph.getCellAt(x, y);
            
            if (!graph.isValidDropTarget(cell))
            {
                cell = null;
            }
            
            return cell;
        };

        // Enables new connections in the graph
        graph.setConnectable(true);
        graph.setMultigraph(false);
        
        var parent = graph.getDefaultParent();
                        
        // Adds cells to the model in a single step
        graph.getModel().beginUpdate();
        try
        {
            //var v1 = graph.insertVertex(parent, null, 'Hello', 20, 80, 80, 30);
            //v1.setConnectable(true);
        }
        finally
        {
            // Updates the display
            graph.getModel().endUpdate();
        }

        // Stops editing on enter or escape keypress
        var keyHandler = new mxKeyHandler(graph);
        var rubberband = new mxRubberband(graph);
        
        var addVertex = function(icon, w, h, style)
        {
            var vertex = graph.insertVertex(parent, null, 'Empty module', 20, 80, 150, 100);
            vertex.code = '';
            vertex.setConnectable(false)
            var vSouth = graph.insertVertex(vertex, null, 'Write', 0.5, 1, 20, 10);
            vSouth.code  = 'Write output variables here.';
            vSouth.geometry.offset = new mxPoint(0, 0);
            vSouth.geometry.relative = true;
            var vNorth = graph.insertVertex(vertex, null, 'Read', 0.5, 0, 20, 10);
            vNorth.code = 'Write input variables here.';
            vNorth.geometry.offset = new mxPoint(0, 0);
            vNorth.geometry.relative = true;
            var vEast = graph.insertVertex(vertex, null, 'Speak', 1, 0.5, 10, 20);
            vEast.code  = 'Write output variables here.';
            vEast.geometry.offset = new mxPoint(0, 0);
            vEast.geometry.relative = true;
            var vWest = graph.insertVertex(vertex, null, 'Listen', 0, 0.5, 10, 20);
            vWest.code = 'Write input variables here.';
            vWest.geometry.offset = new mxPoint(0, 0);
            vWest.geometry.relative = true;
            
            
            vertex.setVertex(true);
        
            addToolbarItem(graph, toolbar, vertex, icon);
        };
        
        addVertex('editors/images/swimlane.gif', 120, 160, 'shape=swimlane;startSize=20;');
        toolbar.addLine();

        button.style.position = 'absolute';
        button.style.left = '2px';
        button.style.top = '2px';
        

        // Edge addition event capture and validation
        graph.addEdge = function(edge, parent, source, target, index){
            if((source.value == 'Speak' && target.value == 'Listen') || (source.value == 'Write' && target.value == 'Read')){
                var tmp = mxGraph.prototype.addEdge.apply(this, arguments);
                return tmp;
            }
        };

        // Delete
        var keyHandler = new mxKeyHandler(graph);
        keyHandler.bindKey(8, function(evt)
        {
            if (graph.isEnabled())
            {
            graph.removeCells();
            }
        });
        graph.centerZoom = false;
        
        var undoManager = new mxUndoManager();
        var listener = function(sender, evt)
        {
            undoManager.undoableEditHappened(evt.getProperty('edit'));
        };
        graph.getModel().addListener(mxEvent.UNDO, listener);
        graph.getView().addListener(mxEvent.UNDO, listener);
        

        // Buttons for undo/redo
        document.body.appendChild(mxUtils.button('Undo', function()
        {
            undoManager.undo();
        }));
        
        document.body.appendChild(mxUtils.button('Redo', function()
        {
            undoManager.redo();
        }));

        // Key mappings for undo/redo
        var keyHandler = new mxKeyHandler(graph);
        keyHandler.bindKey(91, function(evt)
        {
            keyHandler.bindKey(90, function(evt){
                undoManager.undo();
            });
        });

        var keyHandler = new mxKeyHandler(graph);
        keyHandler.bindKey(9, function(evt)
        {
            keyHandler.bindKey(90, function(evt){
                undoManager.redo();
            });
        });

        // document.body.appendChild(button);
        document.body.appendChild(mxUtils.button('Zoom In', function()
        {
            graph.zoomIn();
        }));
        
        document.body.appendChild(mxUtils.button('Zoom Out', function()
        {
            graph.zoomOut();
        }));

        var button = mxUtils.button('Export Graph', function()
        {
            var encoder = new mxCodec();
            var node = encoder.encode(graph.getModel());
            mxUtils.popup(mxUtils.getPrettyXml(node), true);
        });
        document.body.appendChild(button);

        graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt)
        {
            selectionChanged(graph);
        });

        selectionChanged(graph);


        document.body.appendChild(mxUtils.button('Import Graph', function(){
            // var x = document.getElementById('fileUploadField').click();
            
            var newGraph = prompt("Please enter a new graph:", "Paste graph here");


            console.log(newGraph);

            graph.removeCells(graph.getChildVertices(graph.getDefaultParent()))

            var xml = '<root><mxCell id="2" value="Some new vertex" vertex="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></mxCell><mxCell id="3" edge="1" source="2"><mxGeometry relative="1" as="geometry"><mxPoint x="440" y="90" as="targetPoint"/></mxGeometry></mxCell></root>';
            //var xml = newGraph;
            var doc = mxUtils.parseXml(xml);
            var codec = new mxCodec(doc);
            var elt = doc.documentElement.firstChild;
            var cells = [];
            while (elt != null){                
                cells.push(codec.decodeCell(elt));
                graph.refresh();
                elt = elt.nextSibling;
            }

            graph.addCells(cells);
        
        }));
    }
}

function addToolbarItem(graph, toolbar, prototype, image)
{
    // Function that is executed when the image is dropped on
    // the graph. The cell argument points to the cell under
    // the mousepointer if there is one.
    var funct = function(graph, evt, cell)
    {
        graph.stopEditing(false);

        var pt = graph.getPointForEvent(evt);
        var vertex = graph.getModel().cloneCell(prototype);
        vertex.geometry.x = pt.x;
        vertex.geometry.y = pt.y;
        
        graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
    }

    // Creates the image which is used as the drag icon (preview)
    var img = toolbar.addMode(null, image, funct);
    mxUtils.makeDraggable(img, graph, funct);
}

/**
* Updates the properties panel
*/
function selectionChanged(graph)
{
    var div = document.getElementById('properties');

    // Forces focusout in IE
    graph.container.focus();

    // Clears the DIV the non-DOM way
    div.innerHTML = '';

    // Gets the selection cell
    var cell = graph.getSelectionCell();
    
    if (cell == null)
    {
        var center = document.createElement('center');
        mxUtils.writeln(center, 'Nothing selected.');
        div.appendChild(center);
        mxUtils.br(div);
    }
    else
    {
        // Writes the title
        var center = document.createElement('center');
        mxUtils.writeln(center, cell.value);
        div.appendChild(center);
        mxUtils.br(div);

        // Creates the form from the attributes of the user object
        var form = new mxForm();

        var attr = cell.code;
        createTextField(graph, form, cell, attr);

        div.appendChild(form.getTable());
        mxUtils.br(div);
    }
}

/**
* Creates the textfield for the given property.
*/
function createTextField(graph, form, cell, attribute)
{
    var input = form.addTextarea('', attribute, 30);

    var applyHandler = function()
    {
        var newValue = input.value || '';
        graph.getModel().beginUpdate();
        console.log(newValue)
        try
        {
            cell.code = newValue;
        }
        finally
        {
            graph.getModel().endUpdate();
        }
    }; 

    mxEvent.addListener(input, 'keypress', function (evt)
    {
        // Needs to take shift into account for textareas
        if (evt.keyCode == /*enter*/13 &&
            mxEvent.isShiftDown(evt))
        {
            input.blur();
        }
    });

    if (mxClient.IS_IE)
    {
        mxEvent.addListener(input, 'focusout', applyHandler);
    }
    else
    {
        // Note: Known problem is the blurring of fields in
        // Firefox by changing the selection, in which case
        // no event is fired in FF and the change is lost.
        // As a workaround you should use a local variable
        // that stores the focused field and invoke blur
        // explicitely where we do the graph.focus above.
        mxEvent.addListener(input, 'blur', applyHandler);
    }
}