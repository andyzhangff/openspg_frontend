import { useCallback, useState, createContext, useContext } from 'react';
import { useNodesState, useEdgesState, MarkerType } from 'reactflow';

const initialNodes = [
  { id: '1', type: 'custom', position: { x: 450, y: 180 }, data: { label: 'Concept' } },
  { id: '2', type: 'custom', position: { x: 450, y: 420 }, data: { label: 'Entity' } },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'energy',
    animated: true,
  },
];

// Create Context
const SchemaContext = createContext(null);

/**
 * Schema Store Provider
 * Provides global state management for schema editor
 */
export const SchemaProvider = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncErrors, setSyncErrors] = useState([]);

  /**
   * Add new node (for drag and drop)
   */
  const addNode = useCallback((newNode) => {
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  /**
   * Update entire schema from backend data
   */
  const updateSchema = useCallback((backendData) => {
    const processedNodes = (backendData.nodes || []).map(node => ({
      id: node.id || node.ID,
      type: 'custom',
      position: node.position || node.Position || { x: 0, y: 0 },
      data: {
        label: node.data?.label || node.Label || node.label || 'Node',
        category: node.Category || node.category
      }
    }));

    const processedEdges = (backendData.edges || []).map(edge => ({
      id: edge.id || edge.ID,
      source: edge.source || edge.Source,
      target: edge.target || edge.Target,
      type: 'energy',
      animated: true,
      label: edge.label || edge.Label,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      }
    }));

    console.log('Processed nodes:', processedNodes);
    console.log('Processed edges:', processedEdges);

    setNodes(processedNodes);
    setEdges(processedEdges);

    return {
      nodeCount: processedNodes.length,
      edgeCount: processedEdges.length
    };
  }, [setNodes, setEdges]);

  /**
   * Sync to backend and handle validation results
   */
  const syncToBackend = useCallback(async () => {
    try {
      setIsSyncing(true);
      setSyncErrors([]);

      const response = await fetch('http://localhost:8000/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        if (response.status === 422) {
          const errorData = await response.json();
          const formattedErrors = (errorData.errors || []).map(error => ({
            message: error,
            nodeId: extractNodeIdFromError(error),
          }));
          setSyncErrors(formattedErrors);
        } else {
          throw new Error(`Sync failed: ${response.statusText}`);
        }
      } else {
        const successData = await response.json();
        console.log('Sync success:', successData);
        setSyncErrors([]);
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncErrors([{ message: error.message }]);
    } finally {
      setIsSyncing(false);
    }
  }, [nodes, edges]);

  /**
   * Extract node ID from error message
   */
  const extractNodeIdFromError = (errorMessage) => {
    const match = errorMessage.match(/Node (\d+):/);
    return match ? match[1] : null;
  };

  const value = {
    // State
    nodes,
    edges,
    isSyncing,
    syncErrors,
    // Change handlers
    onNodesChange,
    onEdgesChange,
    // Operations
    setNodes,
    setEdges,
    addNode,
    updateSchema,
    syncToBackend,
  };

  return (
    <SchemaContext.Provider value={value}>
      {children}
    </SchemaContext.Provider>
  );
};

/**
 * Hook to use Schema Context
 */
export const useSchemaStore = () => {
  const context = useContext(SchemaContext);
  if (!context) {
    throw new Error('useSchemaStore must be used within a SchemaProvider');
  }
  return context;
};

export default useSchemaStore;
