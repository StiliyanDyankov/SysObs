import { useCallback, useEffect, useRef } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge } from "reactflow";

import "reactflow/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "hahahha" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const useId = () => {
  const id = useRef(0);
  return () => {
    id.current += 1;
    return id.current.toString();
  };
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const getId = useId();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    window.addEventListener("message", (e: MessageEvent) => {
      const message = e.data;

      setNodes((prevNodes) => [
        ...prevNodes,
        {
          id: getId(),
          position: { x: 0, y: 200 },
          data: { label: "works" },
        },
      ]);
    });
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  );
}

export default App;
