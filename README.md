# DFA Optimization and Visualization

Try This: https://shreypatel13ll.github.io/dfa-to-optdfa/

This project provides a web-based tool to visualize and optimize Deterministic Finite Automata (DFA) using Graphviz. The tool allows users to input a DFA, view its graphical representation, and obtain the minimized version of the DFA.

## Features

- **Input DFA:** Enter states, alphabet, transitions, start state, and accept states.
- **Visualize DFA:** Render the DFA and its minimized version using Graphviz.
- **Optimize DFA:** Apply the minimization algorithm to reduce the DFA to its minimal form.

## Algorithm Overview

### DFA Class

The `DFA` class represents a deterministic finite automaton with the following properties:
- `states`: A list of states in the DFA.
- `alphabet`: A list of symbols in the alphabet.
- `transitions`: A dictionary mapping each state and symbol to the next state.
- `startState`: The initial state of the DFA.
- `acceptStates`: A set of accept (or final) states.

### DFA Minimization Algorithm

The DFA minimization algorithm follows these steps to reduce the DFA to its minimal form:

1. **Initialization:**
   - **Partitions:** Start with two partitions:
     - One containing all accept states.
     - Another containing all non-accept states.

2. **Partition Refinement:**
   - Repeatedly refine partitions until no further changes occur. For each partition:
     - Group states based on their transitions. States are grouped together if they transition to the same partitions for all symbols in the alphabet.

3. **State Mapping:**
   - Map each original state to its corresponding new state in the minimized DFA.
   - Create new transitions based on the minimized states.

4. **Construct Minimized DFA:**
   - Build the minimized DFA using the refined partitions and state mappings.

### Convert DFA to Graphviz (DOT) Code

The `dfaToGraphviz` function generates DOT format code for visualizing the DFA. It includes:
- **Start State:** Represented with an incoming arrow.
- **Accept States:** Represented with double circles.
- **Transitions:** Directed edges with labels indicating the symbols.

## Usage

### HTML Form

The HTML form allows users to input DFA details:

- **States:** List of states (comma separated).
- **Alphabet:** List of symbols (comma separated).
- **Transitions:** Transitions in the format `state-symbol-nextState` separated by semicolons.
- **Start State:** The initial state of the DFA.
- **Accept States:** List of accept states (comma separated).

### JavaScript Functions

- **`minimizeDFA(dfa)`**: Applies the DFA minimization algorithm to the input DFA and returns the minimized DFA.
- **`dfaToGraphviz(dfa)`**: Converts the DFA into Graphviz DOT format for visualization.
