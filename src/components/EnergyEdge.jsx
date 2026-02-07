import { memo, useState, useEffect } from 'react';
import { getBezierPath, EdgeLabelRenderer, BaseEdge, useReactFlow } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';

const EnergyEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(label || '');
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // 监听全局点击事件，点击菜单外部时关闭菜单
  useEffect(() => {
    if (showMenu) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.edge-context-menu')) {
          setShowMenu(false);
        }
      };

      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showMenu]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // 菜单出现在标签右侧
    setMenuPosition({ x: labelX + 80, y: labelY });
    setShowMenu(true);
  };

  const handleDelete = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
    setShowMenu(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id ? { ...edge, label: editLabel } : edge
      )
    );
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditLabel(label || '');
      setIsEditing(false);
    }
  };

  return (
    <>
      {/* Main edge path - 简化版：细线，单一颜色 */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: '#00f0ff',
          strokeWidth: 1.5,
          cursor: 'context-menu',
        }}
        onContextMenu={handleContextMenu}
      />

      {/* Animated particle - 更小更低调 */}
      <circle r="2" fill="#00f0ff" opacity="0.8">
        <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
      </circle>

      {/* Label */}
      {(label || isEditing) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            onContextMenu={handleContextMenu}
          >
            {isEditing ? (
              <input
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveEdit}
                autoFocus
                style={{
                  fontSize: 11,
                  color: '#00f0ff',
                  background: 'rgba(0, 0, 0, 0.8)',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  border: '1px solid #00f0ff',
                  outline: 'none',
                  textAlign: 'center',
                  minWidth: '60px',
                }}
                className="nodrag nopan"
              />
            ) : (
              <div
                style={{
                  fontSize: 11,
                  color: '#00f0ff',
                  background: 'rgba(0, 0, 0, 0.6)',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  cursor: 'context-menu',
                }}
                className="nodrag nopan"
              >
                {label}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}

      {/* Context Menu */}
      <AnimatePresence>
        {showMenu && (
          <EdgeLabelRenderer>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -10 }}
              transition={{ duration: 0.15 }}
              className="edge-context-menu"
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${menuPosition.x}px,${menuPosition.y}px)`,
                zIndex: 99999,
              }}
            >
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0)',
                  backdropFilter: 'none',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  minWidth: '120px',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                  className="nodrag nopan"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    width: '100%',
                    textAlign: 'left',
                    color: 'white',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Edit2 size={12} />
                  <span>编辑</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="nodrag nopan"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    width: '100%',
                    textAlign: 'left',
                    color: 'white',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Trash2 size={12} />
                  <span>删除</span>
                </button>
              </div>
            </motion.div>
          </EdgeLabelRenderer>
        )}
      </AnimatePresence>
    </>
  );
});

EnergyEdge.displayName = 'EnergyEdge';

export default EnergyEdge;
