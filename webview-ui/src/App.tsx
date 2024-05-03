import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
} from "reactflow";

import "reactflow/dist/style.css";
import { useEventCallback } from "./utils";
import { ScanEvent } from "./types";

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

const useCoordinates = () => {
  const x = useRef(0);

  return (): Node["position"] => {
    x.current += 100;

    return { x: x.current, y: 0 };
  };
};

const useBuildNode = () => {
  const getId = useId();
  const getCoordinates = useCoordinates();

  return (label: string) => ({
    id: getId(),
    position: getCoordinates(),
    data: { label },
  });
};

const useHandleMessage = (handleMessage: (event: ScanEvent) => void) => {
  const onMessage = useEventCallback((e: MessageEvent<ScanEvent>) => {
    const message = e.data;

    if (message.command === "onScanData") {
      handleMessage(message);
    }
  });

  useEffect(() => {
    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);
};

const useNodes = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const buildNode = useBuildNode();

  useHandleMessage((event) => {
    event.extractedFunctions.forEach((label) => {
      setNodes((ns) => [...ns, buildNode(label)]);
    });
  });

  return [nodes, onNodesChange] as const;
};

function App() {
  const [nodes, onNodesChange] = useNodes();
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

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
