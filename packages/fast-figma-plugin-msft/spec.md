# Problem statement
Different teams use different design tools to design user interfaces. In an ideal world, we could write one plugin that would work across all design tools, however APIs and capabilities across these tools are different. Our goal is to define a generic controller model where implementation details are abstracted away from the primary controller logic. This will allow us to use the same controller logic in any design tool, leaving only a small code footprint that needs to be written for each plugin ecosystem. This will also allow us to more easily test the system, because impelmentation details touching individual design-tool APIs will be abstracted.

# How
The core conerns we need to address are:
1. User interface creation and updates
2. Message handling (both too and from UI)
3. Painting layers
4. Data storage and manipulation


## User interface
The user interface will be defined as a controlled react application. It will be a simple reflection of state, where all state is provided by the controlling application. The App will be defined as an abstract react class, with mechanisms for recieving new state data and posting UI events implemented as abstract methods on the class. Each plugin eco-system will define their own UI class, extending the core UI class and defining abstract properties as it makes sense for that ecosystem.

## Message handling
We will define a strict structure detailing all message types, both to and from the UI. With each message type, any dependent data will be defined and required. Implementation details on how to dispatch and recieve events will be handled by each plugin ecosystem.

## Painting layers
We will define an abstract Painter class which will define a set of potential types of paints. Because this is an concern handled primarily with impelmentation logic, many properties on this class will be abstract.

## Data storage and manipulation
We will define a generic Node class through which we will derive and store all necessary information about drawing layers. This class will provide getter and setter access to recipes, design-system, generated values, etc, and will be the primary type manipulated by the controller.

The controller will be responsible for coordinating all the discrete parts. It will define abstract properties for:
- updating UI
- reacting to selection changes
- recieving messages from the UI

The controller will implement the business logic making updates to nodes and queuing paint opperations.