// DFA Class
class DFA {
  constructor(states, alphabet, transitions, startState, acceptStates) {
    this.states = states;
    this.alphabet = alphabet;
    this.transitions = transitions; // {state: {symbol: nextState}}
    this.startState = startState;
    this.acceptStates = new Set(acceptStates);
  }
}

// DFA Minimization Algorithm
function minimizeDFA(dfa) {
  const { states, alphabet, transitions, startState, acceptStates } = dfa;

  let partitions = [
    new Set(acceptStates),
    new Set(states.filter(state => !acceptStates.has(state))),
  ];

  function getPartitionIndex(state, partitions) {
    for (let i = 0; i < partitions.length; i++) {
      if (partitions[i].has(state)) return i;
    }
    return -1;
  }

  let stable = false;
  while (!stable) {
    stable = true;
    const newPartitions = [];

    for (const partition of partitions) {
      const transitionGroups = new Map();
      for (const state of partition) {
        const transitionsKey = alphabet.map(symbol =>
          getPartitionIndex(transitions[state][symbol], partitions)
        ).toString();

        if (!transitionGroups.has(transitionsKey)) {
          transitionGroups.set(transitionsKey, []);
        }
        transitionGroups.get(transitionsKey).push(state);
      }

      for (const group of transitionGroups.values()) {
        const newPartition = new Set(group);
        newPartitions.push(newPartition);

        if (group.length < partition.size) {
          stable = false;
        }
      }
    }

    partitions = newPartitions;
  }

  const minimizedDFA = new DFA([], alphabet, {}, null, []);

  const stateMapping = new Map();

  for (const [index, partition] of partitions.entries()) {
    const newState = `P${index}`;
    minimizedDFA.states.push(newState);

    for (const oldState of partition) {
      stateMapping.set(oldState, newState);
      if (oldState === startState) {
        minimizedDFA.startState = newState;
      }
      if (acceptStates.has(oldState)) {
        minimizedDFA.acceptStates.add(newState);
      }
    }
  }

  for (const [oldState, newState] of stateMapping.entries()) {
    minimizedDFA.transitions[newState] = {};

    for (const symbol of alphabet) {
      const targetOldState = transitions[oldState][symbol];
      const targetNewState = stateMapping.get(targetOldState);
      minimizedDFA.transitions[newState][symbol] = targetNewState;
    }
  }

  return minimizedDFA;
}

// Convert DFA to Graphviz DOT code
function dfaToGraphviz(dfa) {
  let dot = "digraph DFA {\n";
  dot += "    rankdir=LR;\n"; // Left to right orientation
  dot += "    node [shape=circle];\n";

  // Mark accept states with double circles
  for (const state of dfa.acceptStates) {
    dot += `    "${state}" [shape=doublecircle];\n`;
  }

  // Mark start state with a pointing arrow
  dot += `    "" -> "${dfa.startState}";\n`;

  // Add transitions
  for (const [state, transitions] of Object.entries(dfa.transitions)) {
    for (const [symbol, nextState] of Object.entries(transitions)) {
      dot += `    "${state}" -> "${nextState}" [label="${symbol}"];\n`;
    }
  }

  dot += "}";
  return dot;
}

// Handle form submission
document.getElementById('dfa-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const states = document.getElementById('states').value.split(',').map(s => s.trim());
  const alphabet = document.getElementById('alphabet').value.split(',').map(s => s.trim());
  const transitionsInput = document.getElementById('transitions').value.split(';');
  const transitions = {};
  transitionsInput.forEach(transition => {
    const [state, symbol, nextState] = transition.split('-');
    if (!transitions[state]) transitions[state] = {};
    transitions[state][symbol] = nextState;
  });

  const startState = document.getElementById('start-state').value.trim();
  const acceptStates = new Set(document.getElementById('accept-states').value.split(',').map(s => s.trim()));

  // Create DFA object
  const dfa = new DFA(states, alphabet, transitions, startState, acceptStates);

  // Convert DFA to Graphviz DOT code
  const dfaGraphvizCode = dfaToGraphviz(dfa);

  // Render DFA graph
  const viz = new Viz();
  viz.renderSVGElement(dfaGraphvizCode)
    .then(svgElement => {
      document.getElementById('dfa-graph').innerHTML = '';
      document.getElementById('dfa-graph').appendChild(svgElement);
    })
    .catch(error => console.error(error));

  // Optimize DFA
  const optimizedDFA = minimizeDFA(dfa);

  // Convert Optimized DFA to Graphviz DOT code 
  const optimizedDfaGraphvizCode = dfaToGraphviz(optimizedDFA);

  // Render Optimized DFA graph
  viz.renderSVGElement(optimizedDfaGraphvizCode)
    .then(svgElement => {
      document.getElementById('optimized-dfa-graph').innerHTML = '';
      document.getElementById('optimized-dfa-graph').appendChild(svgElement);
    })
    .catch(error => console.error(error));
});